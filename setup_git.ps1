git init

# Topic 1: Project Setup & Docs
git checkout -b main
git add .gitignore requirements.txt README.md
git commit -m "docs: Initial project setup and documentation"

# Topic 2: Data Generation
git checkout -b feature/data-generation
git add data_generator.py
git commit -m "feat: add synthetic data generator for Sri Lankan context"
git add data/
git commit -m "chore: generate initial synthetic datasets"
git checkout main
git merge feature/data-generation -m "Merge branch 'feature/data-generation'"

# Topic 3: Predictive Models
git checkout -b feature/predictive-models
git add train_models.py models/
git commit -m "feat: implement Random Forest models for delay and churn prediction"
git checkout main
git merge feature/predictive-models -m "Merge branch 'feature/predictive-models'"

# Topic 4: Streamlit Dashboard
git checkout -b feature/dashboard
git add dashboard.py
git commit -m "feat: build interactive Streamlit dashboard for business analytics"
git checkout main
git merge feature/dashboard -m "Merge branch 'feature/dashboard'"
