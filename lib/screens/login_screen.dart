import 'package:flutter/material.dart';

import '../data/areas.dart';
import '../models/donor.dart';
import '../services/app_state.dart';
import '../services/matching_service.dart';
import '../utils.dart';
import 'home_screen.dart';

/// Screen 1: fake login / donor registration (demo OTP = 1234).
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _otp = TextEditingController();
  String _group = 'O+';
  String _area = delhiAreas.first.name;
  DateTime? _lastDonation;
  bool _neverDonated = true;

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _otp.dispose();
    super.dispose();
  }

  void _goHome() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const HomeScreen()),
    );
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final d = await showDatePicker(
      context: context,
      initialDate: _lastDonation ?? now.subtract(const Duration(days: 120)),
      firstDate: DateTime(now.year - 5),
      lastDate: now,
    );
    if (d != null) setState(() => _lastDonation = d);
  }

  void _register() {
    if (!_form.currentState!.validate()) return;
    if (!_neverDonated && _lastDonation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Pick your last donation date')),
      );
      return;
    }
    AppState.instance.registerUser(Donor(
      name: _name.text.trim(),
      bloodGroup: _group,
      area: _area,
      phone: _phone.text.trim(),
      lastDonation: _neverDonated ? null : _lastDonation,
    ));
    _goHome();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _form,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 8),
                Icon(Icons.bloodtype, size: 64, color: scheme.primary),
                const SizedBox(height: 8),
                Text('RaktSetu',
                    textAlign: TextAlign.center,
                    style: Theme.of(context)
                        .textTheme
                        .headlineMedium
                        ?.copyWith(fontWeight: FontWeight.bold)),
                const Text('Smart Blood Donor Matching',
                    textAlign: TextAlign.center),
                const SizedBox(height: 24),
                Text('Register as a donor',
                    style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _name,
                  decoration: const InputDecoration(
                      labelText: 'Full name', border: OutlineInputBorder()),
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Enter your name' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _phone,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                      labelText: 'Phone (10 digits)',
                      border: OutlineInputBorder()),
                  validator: (v) => (v == null || v.trim().length != 10)
                      ? 'Enter a 10-digit number'
                      : null,
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        initialValue: _group,
                        decoration: const InputDecoration(
                            labelText: 'Blood group',
                            border: OutlineInputBorder()),
                        items: bloodGroups
                            .map((g) =>
                                DropdownMenuItem(value: g, child: Text(g)))
                            .toList(),
                        onChanged: (v) => setState(() => _group = v!),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        isExpanded: true,
                        initialValue: _area,
                        decoration: const InputDecoration(
                            labelText: 'Area', border: OutlineInputBorder()),
                        items: delhiAreas
                            .map((a) => DropdownMenuItem(
                                value: a.name, child: Text(a.name)))
                            .toList(),
                        onChanged: (v) => setState(() => _area = v!),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('I have never donated blood'),
                  value: _neverDonated,
                  onChanged: (v) => setState(() => _neverDonated = v),
                ),
                if (!_neverDonated)
                  OutlinedButton.icon(
                    onPressed: _pickDate,
                    icon: const Icon(Icons.calendar_today),
                    label: Text(_lastDonation == null
                        ? 'Pick last donation date'
                        : 'Last donation: ${fmtDate(_lastDonation!)}'),
                  ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _otp,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                      labelText: 'OTP',
                      helperText: 'Demo OTP: 1234 (no real SMS is sent)',
                      border: OutlineInputBorder()),
                  validator: (v) =>
                      v?.trim() == '1234' ? null : 'Wrong OTP (use 1234)',
                ),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: _register,
                  style: FilledButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16)),
                  child: const Text('Register & continue'),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: _goHome,
                  child: const Text('Skip: continue as guest (request only)'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
