Setting up server machine:

1. Install
```
- Meta Trader 5
- NodeJS 8+
- git
- yarn
```
After that, run following commands:
```
make install
cd frontend
git submodule init --update
make install
```

2. Setup MetTrader
Forex data analyser relies on data exported from Meta Trader 5.
- Install `data_exporter.mq5` EA. It's based on https://www.mql5.com/en/code/232
- Attach data_exporter to every chart, you'd like to work with. Keep M1 timeframe!

3. Check `config.js` file

3. Start API
- `make build` Run it once to generate assets
- `make start-api`
