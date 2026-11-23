import 'package:flutter/material.dart';

import '../models/blood_request.dart';
import '../services/app_state.dart';
import '../services/matching_service.dart';
import '../utils.dart';
import 'status_screen.dart';

/// Screen 4: ranked donors (compatible + eligible, nearest first).
/// Contact stays hidden until the donor accepts.
class ResultsScreen extends StatelessWidget {
  final BloodRequest request;
  final MatchResult result;

  const ResultsScreen({super.key, required this.request, required this.result});

  @override
  Widget build(BuildContext context) {
    final app = AppState.instance;
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Matching donors')),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: ListenableBuilder(
            listenable: app,
            builder: (context, _) {
              final pending = result.matches
                  .where((m) => request.responseFor(m.donor) == null)
                  .toList();
              return Row(
                children: [
                  Expanded(
                    child: FilledButton(
                      onPressed: pending.isEmpty
                          ? null
                          : () {
                              for (final m in pending) {
                                app.sendTo(request, m);
                              }
                            },
                      child: Text('Ask all (${pending.length})'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).push(
                        MaterialPageRoute(
                            builder: (_) => const StatusScreen()),
                      ),
                      child: const Text('View status'),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
      body: ListenableBuilder(
        listenable: app,
        builder: (context, _) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                color: scheme.primaryContainer,
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${request.bloodGroup} · ${request.units} unit(s) · ${request.urgency}',
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      Text('${request.hospital}, ${request.area.name}'),
                      const SizedBox(height: 6),
                      Text(
                        '${result.matches.length} eligible donor(s) found'
                        '${result.compatibleButIneligible > 0 ? ' · ${result.compatibleButIneligible} compatible but excluded (donated within $minGapDays days)' : ''}',
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ),
              if (result.matches.isEmpty)
                const Padding(
                  padding: EdgeInsets.all(32),
                  child: Center(
                    child: Text('No eligible donors found right now.'),
                  ),
                ),
              ...result.matches.map((m) {
                final sent = request.responseFor(m.donor) != null;
                final days = m.donor.daysSinceDonation;
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        CircleAvatar(
                          backgroundColor: scheme.primary,
                          foregroundColor: scheme.onPrimary,
                          child: Text(m.donor.bloodGroup,
                              style: const TextStyle(fontSize: 12)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(m.donor.name,
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold)),
                              Text(
                                  '${m.donor.area} · ${m.distanceKm.toStringAsFixed(1)} km'),
                              Text(
                                days == null
                                    ? 'First-time donor'
                                    : 'Last donated ${fmtDate(m.donor.lastDonation!)} ($days days ago)',
                                style: const TextStyle(
                                    fontSize: 12, color: Colors.black54),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(Icons.lock,
                                      size: 14, color: Colors.black45),
                                  const SizedBox(width: 4),
                                  Text(
                                    m.exactGroup
                                        ? 'Exact match · contact hidden'
                                        : 'Compatible · contact hidden',
                                    style: const TextStyle(
                                        fontSize: 12, color: Colors.black54),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        sent
                            ? const Chip(label: Text('Sent'))
                            : FilledButton(
                                onPressed: () => app.sendTo(request, m),
                                child: const Text('Ask'),
                              ),
                      ],
                    ),
                  ),
                );
              }),
              const SizedBox(height: 8),
            ],
          );
        },
      ),
    );
  }
}
