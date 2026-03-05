"""
Management command to seed default RatingScale and ScoringParameter data.
Usage: python manage.py seed_ratings
"""
from django.core.management.base import BaseCommand
from components.models import RatingScale, ScoringParameter


class Command(BaseCommand):
    help = 'Seed default rating scales and scoring parameters'

    def handle(self, *args, **options):
        # ── Rating Scales ─────────────────────────────────────────────────
        scales = [
            (1, 'Below Average', 'Does not meet requirements'),
            (2, 'Average', 'Somewhat meets the requirements'),
            (3, 'Acceptable', 'Acceptable proficiency'),
            (4, 'Excellent', 'Exceeds requirements'),
            (5, 'Outstanding', 'Outstanding performance'),
        ]
        for value, label, desc in scales:
            obj, created = RatingScale.objects.get_or_create(
                value=value,
                defaults={'label': label, 'description': desc},
            )
            status = 'CREATED' if created else 'EXISTS'
            self.stdout.write(f'  [{status}] {obj}')

        # ── Scoring Parameters ────────────────────────────────────────────
        params = [
            ('Communication', 'Communication skills assessment'),
            ('Confidence and Motivation', 'Candidate confidence and motivation level'),
            ('Org. Fit', 'Organizational and cultural fit evaluation'),
            ('Overall Evaluation Score', 'Composite evaluation score'),
            ('Aptitude Score', 'Aptitude test result'),
            ('Hands-on Experience on Primary Skill', 'Practical experience assessment'),
            ('Knowledge of Project Life Cycle', 'Understanding of project management lifecycle'),
            ('Problem Solving', 'Problem-solving ability assessment'),
        ]
        for name, desc in params:
            obj, created = ScoringParameter.objects.get_or_create(
                name=name,
                defaults={'description': desc},
            )
            status = 'CREATED' if created else 'EXISTS'
            self.stdout.write(f'  [{status}] {obj}')

        self.stdout.write(self.style.SUCCESS(
            f'Done! Rating scales: {RatingScale.objects.count()}, '
            f'Scoring parameters: {ScoringParameter.objects.count()}'
        ))
