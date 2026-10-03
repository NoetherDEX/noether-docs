import { ScrollTable } from '@/components/scroll-table';
import snapshot from '@/data/contracts.json';

const ROLES: Record<string, { name: string; role: string }> = {
  market: { name: 'Market', role: 'Trading engine: positions, orders, liquidation, funding' },
  vault: { name: 'Vault', role: 'LP pool and counterparty; holds USDC, issues NOE' },
  noetherRouter: { name: 'Noether Router', role: 'Relays a signed price and trades in one transaction' },
  noeracleShim: { name: 'Noeracle shim', role: 'SEP-40 price reader the market calls' },
  noeracle: { name: 'Noeracle', role: 'Signed price source (pull oracle)' },
  vaultFactory: { name: 'Vault Factory', role: 'User-created trader vaults' },
  referral: { name: 'Referral', role: 'Codes, bindings, fee share and claims' },
  usdcToken: { name: 'USDC', role: 'Test USDC token (Stellar Asset Contract)' },
  noeToken: { name: 'NOE', role: 'Vault share token (Stellar Asset Contract)' },
};

export function contractAddress(key: keyof typeof snapshot.contracts): string {
  return snapshot.contracts[key];
}

export function ContractsTable() {
  const rows = Object.entries(snapshot.contracts);
  return (
    <ScrollTable label="Contract, Role, Address">
      <thead>
        <tr>
          <th>Contract</th>
          <th>Role</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([key, address]) => {
          const meta = ROLES[key] ?? { name: key, role: '' };
          return (
            <tr key={key}>
              <td>{meta.name}</td>
              <td>{meta.role}</td>
              <td>
                <a
                  className="font-mono text-[13px] break-all"
                  href={`https://stellar.expert/explorer/${snapshot.network}/contract/${address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {address}
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </ScrollTable>
  );
}

export function ContractsMeta() {
  return (
    <p className="text-sm text-fd-muted-foreground">
      Snapshot from the gateway on {snapshot.fetchedAt.slice(0, 10)}
      {snapshot.deployedAt ? `, stack deployed ${snapshot.deployedAt.slice(0, 10)}` : ''}. Live values: the
      gateway&apos;s <code>/v1/health</code> response.
    </p>
  );
}

export function Address({ name }: { name: keyof typeof snapshot.contracts }) {
  return <code>{snapshot.contracts[name]}</code>;
}
