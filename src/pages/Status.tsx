import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useService } from '@/contexts/ServiceContext';

export default function Status() {
  const { getRequestsByContact, getRequestById } = useService();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    // Try ticket ID first
    const byId = getRequestById(trimmed);
    if (byId) {
      setResults([byId]);
      return;
    }
    // Then try email/phone
    const list = await getRequestsByContact(trimmed);
    if (list.length === 0) {
      setError('No requests found for that ticket, email, or phone.');
    }
    setResults(list);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <Card>
          <CardHeader>
            <CardTitle>Check Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <div>
                <Label htmlFor="query">Ticket ID, Email, or Phone</Label>
                <Input
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., SC-004 or you@example.com or +1-555-1234"
                  className="min-h-[44px]"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full sm:w-auto min-h-[44px]">Search</Button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive mt-3">{error}</p>}

            <div className="mt-6 space-y-3">
              {results.map((r) => (
                <div key={r.id} className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{r.id}</div>
                      <div className="text-sm text-muted-foreground">{r.customerName} • {r.serviceType}</div>
                    </div>
                    <div className="text-sm">
                      <span className="px-2 py-1 rounded bg-muted">{r.status}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {(() => {
                      let created: Date | null = null;
                      if (r?.createdAt?.toDate) {
                        try { created = r.createdAt.toDate(); } catch {}
                      } else if (typeof r?.createdAt === 'string' || typeof r?.createdAt === 'number') {
                        try { created = new Date(r.createdAt); } catch {}
                      }
                      return (
                        <span>
                          Submitted on {created ? created.toLocaleString() : 'Unknown'}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="mt-2 text-sm">{r.description}</div>
                </div>
              ))}
              {results.length === 0 && !error && (
                <p className="text-sm text-muted-foreground">Enter your ticket, email, or phone to view status.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


