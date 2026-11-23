import 'package:flutter/material.dart';

import '../services/app_state.dart';
import '../services/matching_service.dart';
import '../utils.dart';
import 'login_screen.dart';

/// "Donate Blood": donor profile + eligibility status.
class DonateScreen extends StatelessWidget {
  const DonateScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = AppState.instance;
    return Scaffold(
      appBar: AppBar(title: const Text('Donate Blood')),
      body: ListenableBuilder(
        listenable: app,
        builder: (context, _) {
          final d = app.currentUser;
          if (d == null) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'You are using RaktSetu as a guest.\n'
                      'Register as a donor to receive requests.',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: () =>
                          Navigator.of(context).pushAndRemoveUntil(
                        MaterialPageRoute(
                            builder: (_) => const LoginScreen()),
                        (r) => false,
                      ),
                      child: const Text('Register now'),
                    ),
                  ],
                ),
              ),
            );
          }
          final eligible = MatchingService.isEligible(d);
          final next = MatchingService.nextEligibleDate(d);
          final scheme = Theme.of(context).colorScheme;
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Card(
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: scheme.primary,
                    foregroundColor: scheme.onPrimary,
                    child: Text(d.bloodGroup),
                  ),
                  title: Text(d.name),
                  subtitle: Text('${d.area} · ${d.phone}'),
                ),
              ),
              const SizedBox(height: 8),
              Card(
                color: eligible ? Colors.green.shade50 : Colors.orange.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Icon(
                            eligible ? Icons.check_circle : Icons.hourglass_top,
                            color: eligible ? Colors.green : Colors.orange),
                        const SizedBox(width: 8),
                        Text(
                          eligible
                              ? 'You are eligible to donate'
                              : 'Not eligible yet',
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                      ]),
                      const SizedBox(height: 8),
                      Text(d.lastDonation == null
                          ? 'No previous donation recorded.'
                          : 'Last donation: ${fmtDate(d.lastDonation!)}'),
                      if (!eligible && next != null)
                        Text('Eligible again on ${fmtDate(next)}'),
                      const SizedBox(height: 8),
                      const Text(
                        'Rule: at least $minGapDays days between donations '
                        '(configurable).',
                        style: TextStyle(fontSize: 12, color: Colors.black54),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: app.markDonatedToday,
                icon: const Icon(Icons.water_drop),
                label: const Text('Demo: I donated blood today'),
              ),
              const SizedBox(height: 8),
              const Text(
                'Tip for the demo: tap the button above, then request your own '
                'blood group from another account. You will be excluded '
                'automatically because of the donation gap.',
                style: TextStyle(fontSize: 12, color: Colors.black54),
              ),
            ],
          );
        },
      ),
    );
  }
}
