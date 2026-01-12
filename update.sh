#!/bin/bash

echo "🚀 Démarrage de la mise à jour Next.js..."

# 1. Arrêt des services
echo "🛑 Arrêt des services..."
docker compose down

# 2. Redémarrage avec reconstruction
echo "🔥 Reconstruction et redémarrage..."
docker-compose up -d --build --remove-orphans

echo "⏳ Attente du démarrage (10s)..."
sleep 10

# 3. Verifications et Seed
echo "📦 Vérification de la Base de Données..."

# S'assurer que le dossier prisma est accessible (Fix SQLite "Unable to open")
chmod -R 777 prisma 2>/dev/null || echo "⚠️ Impossible de chmod prisma (peut-être pas nécessaire)"

# Synchroniser le schéma Prisma (Force la version 5 pour éviter l'erreur v7)
echo "   - Push DB Schema..."
docker compose exec -T next-app npx prisma@5.22.0 db push

echo "   - Création/Vérification de l'utilisateur Admin..."
docker compose exec -T next-app node scripts/create-admin.js

echo "✅ Mise à jour terminée !"
echo "👉 Vous pouvez vous connecter avec : admin / admin"
