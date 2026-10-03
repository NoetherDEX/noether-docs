import { ScrollTable } from '@/components/scroll-table';
import snapshot from '@/data/markets.json';

export const marketCount = snapshot.count;
export const openMarketCount = snapshot.openCount;

const STATUS: Record<string, string> = { open: 'Open', 'not-open': 'Not open yet', unknown: '—' };

export function MarketsTable() {
  const notOpen = snapshot.markets.filter((m) => m.status === 'not-open');
  return (
    <>
      <ScrollTable label="Pair, Asset, Symbol, Status">
        <thead>
          <tr>
            <th>Pair</th>
            <th>Asset</th>
            <th>Symbol</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {snapshot.markets.map((m) => (
            <tr key={m.symbol}>
              <td className="font-mono">{m.symbol}-PERP</td>
              <td>{m.name}</td>
              <td className="font-mono">{m.symbol}</td>
              <td className={m.status === 'open' ? undefined : 'text-fd-muted-foreground'}>{STATUS[m.status] ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </ScrollTable>
      {notOpen.length > 0 ? (
        <p className="text-sm text-fd-muted-foreground">
          {notOpen.map((m) => m.symbol).join(' and ')} {notOpen.length === 1 ? 'is' : 'are'} listed by the gateway, but
          the market rejects new positions on {notOpen.length === 1 ? 'it' : 'them'} (error #88) until{' '}
          {notOpen.length === 1 ? 'its' : 'their'} risk parameters are set. Snapshot from {snapshot.fetchedAt.slice(0, 10)}.
        </p>
      ) : null}
    </>
  );
}
