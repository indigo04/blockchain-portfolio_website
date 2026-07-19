import { TokenTransaction } from "@/types/TokenTransaction";
import { fetchTokenTransactions } from "@/utils/FetchTokenTransactions";
import { SliceAddress } from "@/utils/SliceAddress";
import { CopyAddress } from "../shared/CopyAddress";
import { cacheTag } from "next/cache";

export const FaucetHistory = async () => {
  "use cache";
  cacheTag("history");
  const history: TokenTransaction[] = await fetchTokenTransactions();
  return (
    <div className="flex flex-col w-full gap-2 p-4 bg-surface rounded-xl border border-muted/25">
      <h2 className="text-text text-3xl font-bold">Resent Transactions</h2>
      {history.length === 0 ? (
        <p className="text-muted">History Is Empty</p>
      ) : (
        <div className="overflow-x-auto bg-surface py-1 w-full border border-muted/25 rounded-xl">
          <table className="w-full text-center">
            <thead className="text-muted text-nowrap">
              <tr>
                <th className="p-2">To</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Transaction Hash</th>
              </tr>
            </thead>
            <tbody className="text-white font-bold">
              {history.map((el) => (
                <tr key={el.id}>
                  <td className="p-1">
                    <div className="flex gap-2 min-w-60 justify-center items-center">
                      {SliceAddress(el.to)}
                      <CopyAddress address={el.to} />
                    </div>
                  </td>
                  <td className="p-1 truncate max-w-40">{el.amount}</td>
                  <td className="p-1">
                    <div className="flex gap-2 min-w-60 justify-center items-center">
                      {SliceAddress(el.txHash)}
                      <CopyAddress address={el.txHash} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
