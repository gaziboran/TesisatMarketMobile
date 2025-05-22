import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/api_config.dart';
import '../models/plumber_request.dart';

class PlumberRequestScreen extends StatefulWidget {
  final String token;
  final String userId;

  const PlumberRequestScreen({
    Key? key,
    required this.token,
    required this.userId,
  }) : super(key: key);

  @override
  State<PlumberRequestScreen> createState() => _PlumberRequestScreenState();
}

class _PlumberRequestScreenState extends State<PlumberRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _problemController = TextEditingController();
  bool _isLoading = false;

  Future<void> _submitRequest() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/plumber-requests'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}',
        },
        body: jsonEncode({
          'userId': widget.userId,
          'address': _addressController.text,
          'phoneNumber': _phoneController.text,
          'problemDescription': _problemController.text,
          'status': 'pending',
        }),
      );

      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Tesisatçı talebiniz başarıyla oluşturuldu')),
        );
        Navigator.pop(context);
      } else {
        throw Exception('Talep oluşturulurken bir hata oluştu');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Hata: ${e.toString()}')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tesisatçı Çağır'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _addressController,
                decoration: const InputDecoration(
                  labelText: 'Adres',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Lütfen adresinizi girin';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(
                  labelText: 'Telefon Numarası',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Lütfen telefon numaranızı girin';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _problemController,
                decoration: const InputDecoration(
                  labelText: 'Tesisat Sorunu',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Lütfen tesisat sorununuzu açıklayın';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _submitRequest,
                child: _isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Tesisatçı Çağır'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _addressController.dispose();
    _phoneController.dispose();
    _problemController.dispose();
    super.dispose();
  }
} 