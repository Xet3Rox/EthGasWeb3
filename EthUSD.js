// Client side
useEffect(() => {
    const fn = async () => {
      const transactions =
        trnxs?.map(async (trnx) => {
          const trnxDate = new Date(trnx.timeStamp * 1000);
          let formatted_date =
            trnxDate.getDate() +
            "-" +
            (trnxDate.getMonth() + 1) +
            "-" +
            trnxDate.getFullYear();
          const ethPriceHistoryUrl = `/api/coingecko-history?date=${formatted_date}`;
          const historyData = await fetch(ethPriceHistoryUrl).then((resp) =>
            resp.json()
          );
          const ethUSD = historyData?.market_data?.current_price?.usd;
          return {
            ...trnx,
            gasFee: (trnx.gasPrice * trnx.gasUsed * ethUSD) / 1e18,
            gasFeeEth: (trnx.gasPrice * trnx.gasUsed) / 1e18,
            ethUSD: ethUSD,
          };
        }) ?? [];
      const values = await Promise.all(transactions);
      setUpdatedTrnxs(values);
    };
    fn();
  }, [trnxs]);

// Api route
export default async function handler(req, res) {
  // Run cors
  await cors(req, res);
  const query = req.query;
  const url = `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${query?.date}`;
  const response = await fetch(url).then(resp => resp.json());
  res.json(response);
}
