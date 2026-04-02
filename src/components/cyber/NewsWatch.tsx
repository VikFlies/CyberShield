import { useState, useEffect } from 'react';
import { mockNews } from '@/lib/mock-news';
import { updateState, getState } from '@/lib/state';
import type { NewsArticle } from '@/lib/state';
import { Search, AlertTriangle, AlertCircle, Info, Loader2 } from 'lucide-react';

const categories = ['Toutes', 'Ransomware', 'Vulnérabilités', 'Phishing', 'Malwares', 'Réseaux', 'IA & Menaces', 'Bonnes pratiques', 'Cryptographie', 'Fuites de données', 'Mises à jour', 'Supply Chain'];

const NewsWatch = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Toutes');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Vérifier le cache (15 min)
      const st = getState();
      if (st.newsCache && st.newsCacheTime && Date.now() - st.newsCacheTime < 900000) {
        setNews(st.newsCache);
        setLoading(false);
        return;
      }

      // Simuler un délai réseau, puis utiliser les données mockées
      await new Promise(r => setTimeout(r, 800));
      setNews(mockNews);
      updateState({ newsCache: mockNews, newsCacheTime: Date.now() });
    } catch {
      setError("Impossible de charger les actualités. Utilisation des données de secours.");
      setNews(mockNews);
    } finally {
      setLoading(false);
    }
  };

  // Filtre et recherche
  const filtered = news
    .filter(a => category === 'Toutes' || a.category === category)
    .filter(a => {
      const q = search.toLowerCase();
      return !q || a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q);
    });

  // Niveau d'alerte global
  const highCount = news.filter(a => a.severity === 'high').length;
  let alertLevel = 'Faible';
  let alertColor = 'text-success';
  let AlertIcon = Info;
  if (highCount >= 4) { alertLevel = 'Élevé'; alertColor = 'text-destructive'; AlertIcon = AlertTriangle; }
  else if (highCount >= 2) { alertLevel = 'Moyen'; alertColor = 'text-warning'; AlertIcon = AlertCircle; }

  const severityBadge = (s: string) => {
    if (s === 'high') return 'bg-destructive/10 text-destructive';
    if (s === 'medium') return 'bg-warning/10 text-warning';
    return 'bg-success/10 text-success';
  };

  const severityLabel = (s: string) => {
    if (s === 'high') return 'Critique';
    if (s === 'medium') return 'Modéré';
    return 'Info';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-3 text-muted-foreground">Chargement des actualités...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">📡 Veille Cybersécurité</h2>
        <p className="text-muted-foreground text-sm">Dernières actualités et menaces en cybersécurité.</p>
      </div>

      {error && (
        <div className="card-cyber border-warning/30">
          <p className="text-sm text-warning">⚠️ {error}</p>
        </div>
      )}

      {/* Alerte globale */}
      <div className="card-cyber flex items-center gap-4">
        <AlertIcon className={`w-8 h-8 ${alertColor}`} />
        <div>
          <p className="text-sm text-muted-foreground">Niveau d'alerte global</p>
          <p className={`text-xl font-bold ${alertColor}`}>{alertLevel}</p>
          <p className="text-xs text-muted-foreground">{highCount} articles critiques sur {news.length}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Articles */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Aucun article trouvé.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((article, i) => (
            <article key={i} className="card-cyber">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-foreground font-semibold mb-1">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{article.summary}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className="text-primary">{article.category}</span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${severityBadge(article.severity)}`}>
                  {severityLabel(article.severity)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsWatch;
