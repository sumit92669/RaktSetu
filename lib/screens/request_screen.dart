import 'package:flutter/material.dart';

import '../data/areas.dart';
import '../services/app_state.dart';
import '../services/matching_service.dart';
import 'results_screen.dart';

/// Screen 3: create a blood request.
class RequestScreen extends StatefulWidget {
  const RequestScreen({super.key});

  @override
  State<RequestScreen> createState() => _RequestScreenState();
}

class _RequestScreenState extends State<RequestScreen> {
  final _form = GlobalKey<FormState>();
  final _hospital = TextEditingController();
  final _contact = TextEditingController();
  String _group = 'B+';
  String _area = 'Connaught Place';
  int _units = 1;
  String _urgency = 'Urgent';

  @override
  void initState() {
    super.initState();
    final u = AppState.instance.currentUser;
    if (u != null) _contact.text = u.phone;
  }

  @override
  void dispose() {
    _hospital.dispose();
    _contact.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_form.currentState!.validate()) return;
    final app = AppState.instance;
    final req = app.createRequest(
      bloodGroup: _group,
      units: _units,
      hospital: _hospital.text.trim(),
      area: areaByName(_area),
      urgency: _urgency,
      contact: _contact.text.trim(),
    );
    final result = app.match(req);
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
          builder: (_) => ResultsScreen(request: req, result: result)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Request Blood')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _form,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              DropdownButtonFormField<String>(
                initialValue: _group,
                decoration: const InputDecoration(
                    labelText: 'Blood group needed',
                    border: OutlineInputBorder()),
                items: bloodGroups
                    .map((g) => DropdownMenuItem(value: g, child: Text(g)))
                    .toList(),
                onChanged: (v) => setState(() => _group = v!),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Text('Units needed', style: TextStyle(fontSize: 16)),
                  const Spacer(),
                  IconButton.outlined(
                    onPressed:
                        _units > 1 ? () => setState(() => _units--) : null,
                    icon: const Icon(Icons.remove),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text('$_units',
                        style: const TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
                  IconButton.outlined(
                    onPressed:
                        _units < 10 ? () => setState(() => _units++) : null,
                    icon: const Icon(Icons.add),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _hospital,
                decoration: const InputDecoration(
                    labelText: 'Hospital name', border: OutlineInputBorder()),
                validator: (v) => (v == null || v.trim().isEmpty)
                    ? 'Enter hospital name'
                    : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                isExpanded: true,
                initialValue: _area,
                decoration: const InputDecoration(
                    labelText: 'Hospital area (Delhi)',
                    border: OutlineInputBorder()),
                items: delhiAreas
                    .map((a) =>
                        DropdownMenuItem(value: a.name, child: Text(a.name)))
                    .toList(),
                onChanged: (v) => setState(() => _area = v!),
              ),
              const SizedBox(height: 16),
              const Text('Urgency', style: TextStyle(fontSize: 16)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: ['Critical', 'Urgent', 'Normal']
                    .map((u) => ChoiceChip(
                          label: Text(u),
                          selected: _urgency == u,
                          onSelected: (_) => setState(() => _urgency = u),
                        ))
                    .toList(),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _contact,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                    labelText: 'Your contact number',
                    helperText: 'Shared with a donor only after they accept',
                    border: OutlineInputBorder()),
                validator: (v) => (v == null || v.trim().length != 10)
                    ? 'Enter a 10-digit number'
                    : null,
              ),
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: _submit,
                icon: const Icon(Icons.search),
                label: const Text('Find matching donors'),
                style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
