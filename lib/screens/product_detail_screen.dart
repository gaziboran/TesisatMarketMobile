import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/api_config.dart';
import '../services/auth_service.dart';

class ProductDetailScreen extends StatefulWidget {
  final String productId;
  final String token;
  final String userId;
  final String username;

  const ProductDetailScreen({
    Key? key,
    required this.productId,
    required this.token,
    required this.userId,
    required this.username,
  }) : super(key: key);

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final TextEditingController _commentController = TextEditingController();
  bool _isSubmittingComment = false;
  int _selectedRating = 0;
  List<Map<String, dynamic>> _comments = [];

  @override
  void initState() {
    super.initState();
    _loadComments();
  }

  Future<void> _loadComments() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/products/${widget.productId}/comments'),
        headers: {
          'Authorization': 'Bearer ${widget.token}',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> comments = jsonDecode(response.body);
        setState(() {
          _comments = comments.cast<Map<String, dynamic>>();
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Yorumlar yüklenirken hata oluştu: ${e.toString()}')),
      );
    }
  }

  Future<void> _handleCommentSubmit() async {
    if (_commentController.text.trim().isEmpty) return;

    setState(() {
      _isSubmittingComment = true;
    });

    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/products/${widget.productId}/comments'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}',
        },
        body: jsonEncode({
          'content': _commentController.text.trim(),
          'rating': _selectedRating,
          'user': {
            'id': widget.userId,
            'username': widget.username,
          },
        }),
      );

      if (response.statusCode == 201) {
        _commentController.clear();
        setState(() {
          _selectedRating = 0;
        });
        _loadComments();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Yorumunuz başarıyla eklendi')),
        );
      } else {
        throw Exception('Yorum eklenirken bir hata oluştu');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Hata: ${e.toString()}')),
      );
    } finally {
      setState(() {
        _isSubmittingComment = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ürün Detayı'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Ürün detayları buraya gelecek
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Yorumlar',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Yorum formu
                  TextField(
                    controller: _commentController,
                    decoration: const InputDecoration(
                      hintText: 'Yorumunuzu yazın...',
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 8),
                  // Yıldız derecelendirme
                  Row(
                    children: List.generate(5, (index) {
                      return IconButton(
                        icon: Icon(
                          index < _selectedRating ? Icons.star : Icons.star_border,
                          color: Colors.amber,
                        ),
                        onPressed: () {
                          setState(() {
                            _selectedRating = index + 1;
                          });
                        },
                      );
                    }),
                  ),
                  ElevatedButton(
                    onPressed: _isSubmittingComment ? null : _handleCommentSubmit,
                    child: _isSubmittingComment
                        ? const CircularProgressIndicator()
                        : const Text('Yorum Yap'),
                  ),
                  const SizedBox(height: 16),
                  // Yorumlar listesi
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _comments.length,
                    itemBuilder: (context, index) {
                      final comment = _comments[index];
                      return Card(
                        child: ListTile(
                          title: Text(comment['user']['username'] ?? 'Anonim'),
                          subtitle: Text(comment['content'] ?? ''),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: List.generate(
                              comment['rating'] ?? 0,
                              (index) => const Icon(Icons.star, color: Colors.amber, size: 16),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }
} 