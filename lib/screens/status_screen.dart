import 'package:flutter/material.dart';

import '../models/blood_request.dart';
import '../services/app_state.dart';

/// Screen 5: request status (pending / accepted / declined).
/// Contact is shown only after the donor accepts.
class StatusScreen extends StatelessWidget {
  const StatusScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = AppState.instance;
    return Scaffold(
      appBar: AppBar(title: const Text('Request status')),
      body: ListenableBuilder(
        listenable: app,
        builder: (context, _) {
          if (app.requests.isEmpty) {
            return const Center(child: Text('No requests yet.'));
          }
          final reqs = app.requests.reversed.toList();
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              for (final r in reqs) _RequestCard(request: r),
              const Padding(
                padding: EdgeInsets.all(8),
                child: Text(
                  'In a real app the donor would reply from their own phone. '
                  'The demo buttons simulate that reply.',
                  style: TextStyle(fontSize: 12, color: Colors.black54),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _RequestCard extends StatelessWidget {
  final BloodRequest request;
  const _RequestCard({required this.request});

  @override
  Widget build(BuildContext context) {
    final app = AppState.instance;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${request.bloodGroup} · ${request.units} unit(s) · ${request.urgency}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            Text('${request.hospital}, ${request.area.name}'),
            const Divider(height: 20),
            if (request.responses.isEmpty)
              const Text(
                  'No donors asked yet. Go back to the results and tap Ask.',
                  style: TextStyle(color: Colors.black54)),
            for (final resp in request.responses) ...[
              Row(
                children: [
                  Expanded(
                    child: Text(
                      '${resp.donor.name} (${resp.donor.bloodGroup}) · ${resp.distanceKm.toStringAsFixed(1)} km',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                  _StatusChip(resp.status),
                ],
              ),
              const SizedBox(height: 4),
              if (resp.status == RequestStatus.pending)
                Row(
                  children: [
                    TextButton(
                      onPressed: () =>
                          app.respond(resp, RequestStatus.accepted),
                      child: const Text('Demo: donor accepts'),
                    ),
                    TextButton(
                      onPressed: () =>
                          app.respond(resp, RequestStatus.declined),
                      child: const Text('Demo: donor declines'),
                    ),
                  ],
                ),
              if (resp.status == RequestStatus.accepted)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.lock_open,
                          size: 18, color: Colors.green),
                      const SizedBox(width: 8),
                      SelectableText('Contact: ${resp.donor.phone}'),
                    ],
                  ),
                ),
              const SizedBox(height: 10),
            ],
          ],
        ),
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final RequestStatus status;
  const _StatusChip(this.status);

  @override
  Widget build(BuildContext context) {
    late final String label;
    late final Color color;
    switch (status) {
      case RequestStatus.pending:
        label = 'Pending';
        color = Colors.orange.shade100;
      case RequestStatus.accepted:
        label = 'Accepted';
        color = Colors.green.shade100;
      case RequestStatus.declined:
        label = 'Declined';
        color = Colors.red.shade100;
    }
    return Chip(label: Text(label), backgroundColor: color);
  }
}
