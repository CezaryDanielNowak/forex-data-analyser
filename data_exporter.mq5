//+------------------------------------------------------------------+
//|                                                data_exporter.mq5 |
//|                                              Cezary Daniel Nowak |
//|                                                                  |
//+------------------------------------------------------------------+
#property copyright "Cezary Daniel Nowak"
#property link      ""
#property version   "1.00"
#include <Files\File.mqh>
#include <Files\FileTxt.mqh>

input int periodSeconds = 60;

string ExtFileName; // ="XXXXXX_PERIOD.CSV";

int OnInit() {
  EventSetTimer(periodSeconds);
  return INIT_SUCCEEDED;
}

void OnDeinit(const int reason) {
  EventKillTimer();
}

void OnTimer() {
  CollectChartData();
}

void CollectChartData() {
  CFileTxt File;
  MqlRates rates_array[];
  string sSymbol = Symbol();
  string sPeriod = PeriodToStr(Period());

  Comment("PREPARING... wait... ");
  // prepare file name, for example, EURUSD1
  ExtFileName = sSymbol;
  StringConcatenate(ExtFileName, sSymbol, "_", sPeriod, ".CSV");
  ArraySetAsSeries(rates_array, true);
  int iMaxBar = TerminalInfoInteger(TERMINAL_MAXBARS);
  string format = "%G,%G,%G,%G,%d";

  int iCod = CopyRates(sSymbol, Period(), 0, iMaxBar, rates_array);

  if (iCod > 1) {
    File.Open(ExtFileName, FILE_WRITE, 9);
    for (int i = iCod - 1; i > 0; i--) {
      // prepare a string:
      // 2009.01.05,12:49,1.36770,1.36780,1.36760,1.36760,8
      string sOut = StringFormat("%s", TimeToString(rates_array[i].time, TIME_DATE));
      sOut = sOut + "," + TimeToString(rates_array[i].time, TIME_MINUTES);
      sOut = sOut + "," + StringFormat(format,
        rates_array[i].open,
        rates_array[i].high,
        rates_array[i].low,
        rates_array[i].close,
        rates_array[i].tick_volume);
      sOut = sOut + "\n";
      File.WriteString(sOut);
    }
    File.Close();
  }
  Comment("OK. ready... ");
}

string PeriodToStr(ENUM_TIMEFRAMES period) {
   string strper;
   bool res=true;

   switch(period) {
      case PERIOD_MN1 : return "MN1"; break;
      case PERIOD_W1 :  return "W1";  break;
      case PERIOD_D1 :  return "D1";  break;
      case PERIOD_H1 :  return "H1";  break;
      case PERIOD_H2 :  return "H2";  break;
      case PERIOD_H3 :  return "H3";  break;
      case PERIOD_H4 :  return "H4";  break;
      case PERIOD_H6 :  return "H6";  break;
      case PERIOD_H8 :  return "H8";  break;
      case PERIOD_H12 : return "H12"; break;
      case PERIOD_M1 :  return "M1";  break;
      case PERIOD_M2 :  return "M2";  break;
      case PERIOD_M3 :  return "M3";  break;
      case PERIOD_M4 :  return "M4";  break;
      case PERIOD_M5 :  return "M5";  break;
      case PERIOD_M6 :  return "M6";  break;
      case PERIOD_M10 : return "M10"; break;
      case PERIOD_M12 : return "M12"; break;
      case PERIOD_M15 : return "M15"; break;
      case PERIOD_M20 : return "M20"; break;
      case PERIOD_M30 : return "M30"; break;
      default : {
            Alert("Invalid period passed to PeriodToStr");
            ExpertRemove();
      };
   }

//---
   return strper;
  }
//+------------------------------------------------------------------+
