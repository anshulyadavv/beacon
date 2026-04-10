import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { useChartData } from '../../hooks/useChartData';

export default function Chart({ ticker, timeframe }) {
  const chartContainerRef = useRef(null);
  const { data, loading, error } = useChartData(ticker, timeframe);
  const [chartReady, setChartReady] = useState(false);

  const isIntraday = timeframe === '1D' || timeframe === '1W';

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8e8e93',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      timeScale: {
        timeVisible: isIntraday,
        secondsVisible: false,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        rightOffset: 12,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        autoScale: true,
      },
      crosshair: {
        mode: 1, // Magnet mode
        vertLine: {
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1,
          style: 3, // Dotted
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1,
          style: 3,
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    // Add main candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#30d158',
      downColor: '#ff453a',
      borderVisible: false,
      wickUpColor: '#30d158',
      wickDownColor: '#ff453a',
    });

    // Add volume series as histogram
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Set as overlay
    });

    // Configure the volume price scale
    chart.priceScale('').applyOptions({
      scaleMargins: {
        top: 0.8, // leave space at the top
        bottom: 0,
      },
    });

    if (data && data.length > 0) {
      // Ensure data is sorted by time and dates are strictly unique
      const sortedData = [...data].sort((a, b) => a.time - b.time);
      
      // De-duplicate times (lightweight charts throws error if times repeat)
      const uniqueDataMap = new Map();
      sortedData.forEach(item => {
        uniqueDataMap.set(item.time, item);
      });
      const uniqueData = Array.from(uniqueDataMap.values()).sort((a, b) => a.time - b.time);

      candlestickSeries.setData(uniqueData);
      
      // Map to volume format
      const volumeData = uniqueData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? 'rgba(48, 209, 88, 0.4)' : 'rgba(255, 69, 58, 0.4)'
      }));
      volumeSeries.setData(volumeData);
      
      chart.timeScale().fitContent();
    }

    setChartReady(true);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, isIntraday]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && !chartReady && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 15,
          background: "rgba(11,11,12,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: 13, color: "#8e8e93", fontWeight: 500 }}>Fetching data…</div>
        </div>
      )}
      
      {error && (
         <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff453a' }}>
            Failed to load chart data for {ticker}
         </div>
      )}

      {/* LW Charts container */}
      <div
        ref={chartContainerRef}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      />
    </div>
  );
}