import snapshot from '@/data/markets.json';

export const marketCount = snapshot.count;

export function MarketsTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Pair</th>
          <th>Asset</th>
          <th>Symbol</th>
        </tr>
      </thead>
      <tbody>
        {snapshot.markets.map((m) => (
          <tr key={m.symbol}>
            <td className="font-mono">{m.symbol}-PERP</td>
            <td>{m.name}</td>
            <td className="font-mono">{m.symbol}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
