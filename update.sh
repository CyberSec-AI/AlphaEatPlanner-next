#!/bin/bash

echo "🚀 Démarrage de la mise à jour Next.js..."

# 1. Arrêt des services
echo "🛑 Arrêt des services..."
docker-compose down

# 2. Redémarrage avec reconstruction
echo "🔥 Reconstruction et redémarrage..."
docker-compose up -d --build --remove-orphans

echo "⏳ Attente du démarrage (10s)..."
sleep 10

# 3. Verifications et Seed
echo "📦 Vérification de la Base de Données..."

# Synchroniser le schéma Prisma (juste au cas où le container ne l'a pas fait)
echo "   - Push DB Schema..."
docker-compose exec -T next-app npx prisma db push

echo "   - Création/Vérification de l'utilisateur Admin..."
docker-compose exec -T next-app node scripts/create-admin.js

echo "✅ Mise à jour terminée !"
echo "👉 Vous pouvez vous connecter avec : admin / admin"
