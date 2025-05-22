class PlumberRequest {
  final String id;
  final String userId;
  final String address;
  final String phoneNumber;
  final String problemDescription;
  final DateTime createdAt;
  final String status; // 'pending', 'accepted', 'completed', 'cancelled'

  PlumberRequest({
    required this.id,
    required this.userId,
    required this.address,
    required this.phoneNumber,
    required this.problemDescription,
    required this.createdAt,
    required this.status,
  });

  factory PlumberRequest.fromJson(Map<String, dynamic> json) {
    return PlumberRequest(
      id: json['id'],
      userId: json['userId'],
      address: json['address'],
      phoneNumber: json['phoneNumber'],
      problemDescription: json['problemDescription'],
      createdAt: DateTime.parse(json['createdAt']),
      status: json['status'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'address': address,
      'phoneNumber': phoneNumber,
      'problemDescription': problemDescription,
      'createdAt': createdAt.toIso8601String(),
      'status': status,
    };
  }
} 