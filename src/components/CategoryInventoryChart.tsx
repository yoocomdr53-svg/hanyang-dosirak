import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { MenuItem, MenuCategory } from '../types';
import { BarChart3, PieChart, Sparkles, AlertCircle, TrendingUp, PackageCheck, Layers } from 'lucide-react';

interface CategoryInventoryChartProps {
  menus: MenuItem[];
  categories: MenuCategory[];
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
}

interface CategoryStat {
  category: string;
  totalCount: number;
  availableCount: number;
  soldOutCount: number;
  percentage: number;
  bestCount: number;
  recCount: number;
  avgPrice: number;
}

export const CategoryInventoryChart: React.FC<CategoryInventoryChartProps> = ({
  menus,
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<'bar' | 'donut'>('bar');
  const [sortBy, setSortBy] = useState<'count' | 'soldOut' | 'name'>('count');
  const [hoveredCategory, setHoveredCategory] = useState<CategoryStat | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Compute category statistics
  const data: CategoryStat[] = useMemo(() => {
    const totalVisibleMenus = menus.filter((m) => m.isVisible).length || 1;

    const stats = categories.map((cat) => {
      const catMenus = menus.filter((m) => m.category.includes(cat) && m.isVisible);
      const total = catMenus.length;
      const soldOut = catMenus.filter((m) => m.isSoldOut).length;
      const available = total - soldOut;
      const best = catMenus.filter((m) => m.isBest).length;
      const rec = catMenus.filter((m) => m.isRec).length;
      const avgPrice = total > 0 ? Math.round(catMenus.reduce((sum, m) => sum + m.price, 0) / total) : 0;

      return {
        category: cat,
        totalCount: total,
        availableCount: available,
        soldOutCount: soldOut,
        percentage: Number(((total / totalVisibleMenus) * 100).toFixed(1)),
        bestCount: best,
        recCount: rec,
        avgPrice,
      };
    });

    // Sorting
    return [...stats].sort((a, b) => {
      if (sortBy === 'count') return b.totalCount - a.totalCount;
      if (sortBy === 'soldOut') return b.soldOutCount - a.soldOutCount;
      return a.category.localeCompare(b.category, 'ko');
    });
  }, [menus, categories, sortBy]);

  // Color palette for Korean Dosirak Brand (Terracotta, Sage, Warm Amber, Wood, Warm Stone)
  const colorScale = useMemo(() => {
    const brandColors = [
      '#C25E3E', // Terracotta
      '#D97706', // Warm Amber
      '#6B7280', // Slate Gray
      '#059669', // Emerald
      '#854D0E', // Warm Brown
      '#7C3AED', // Soft Purple
      '#0284C7', // Sky Blue
      '#DC2626', // Red
    ];
    return d3.scaleOrdinal<string, string>()
      .domain(categories)
      .range(brandColors);
  }, [categories]);

  // D3 Render logic with ResizeObserver
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !isExpanded) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = chartType === 'bar' ? Math.max(220, data.length * 36 + 40) : 240;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

    if (data.length === 0) return;

    if (chartType === 'bar') {
      const margin = { top: 15, right: 65, bottom: 25, left: width < 480 ? 65 : 85 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      // Scales
      const maxCount = Math.max(d3.max(data, (d) => d.totalCount) || 5, 5);
      const xScale = d3.scaleLinear().domain([0, maxCount]).range([0, innerWidth]).nice();
      const yScale = d3.scaleBand().domain(data.map((d) => d.category)).range([0, innerHeight]).padding(0.28);

      // Grid lines
      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(
          d3.axisBottom(xScale)
            .ticks(Math.min(maxCount, 6))
            .tickSize(-innerHeight)
            .tickFormat(() => '')
        )
        .call((axis) => axis.select('.domain').remove())
        .call((axis) => axis.selectAll('line').attr('stroke', '#E7E2DA').attr('stroke-dasharray', '2,2'));

      // Category Bars Group
      const barGroups = g.selectAll('.bar-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', (d) => `translate(0,${yScale(d.category) || 0})`)
        .style('cursor', 'pointer')
        .on('mouseenter', (_, d) => setHoveredCategory(d))
        .on('mouseleave', () => setHoveredCategory(null))
        .on('click', (_, d) => onSelectCategory && onSelectCategory(d.category));

      // Background track
      barGroups.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', innerWidth)
        .attr('height', yScale.bandwidth())
        .attr('rx', 4)
        .attr('fill', '#F5F2EC');

      // Available items bar (Active)
      barGroups.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', (d) => xScale(d.availableCount))
        .attr('height', yScale.bandwidth())
        .attr('rx', 4)
        .attr('fill', (d) => {
          if (selectedCategory && selectedCategory === d.category) return '#A6482A';
          return colorScale(d.category);
        })
        .attr('opacity', (d) => (selectedCategory && selectedCategory !== d.category ? 0.45 : 0.95))
        .transition()
        .duration(600)
        .ease(d3.easeCubicOut)
        .attr('width', (d) => xScale(d.availableCount));

      // Sold out items bar segment (Stacked at end)
      barGroups.filter((d) => d.soldOutCount > 0)
        .append('rect')
        .attr('x', (d) => xScale(d.availableCount))
        .attr('y', 0)
        .attr('width', (d) => xScale(d.soldOutCount))
        .attr('height', yScale.bandwidth())
        .attr('rx', 3)
        .attr('fill', '#EF4444')
        .attr('opacity', 0.85);

      // Y-axis category names
      g.append('g')
        .call(d3.axisLeft(yScale).tickSize(0))
        .call((axis) => axis.select('.domain').remove())
        .selectAll('text')
        .style('font-size', '11px')
        .style('font-weight', '700')
        .style('fill', '#2D2823')
        .style('cursor', 'pointer')
        .on('click', (_, cat) => onSelectCategory && onSelectCategory(cat as string));

      // Value & Percentage Labels at end of bar
      barGroups.append('text')
        .attr('x', (d) => xScale(d.totalCount) + 6)
        .attr('y', yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .style('font-size', '10.5px')
        .style('font-weight', '700')
        .style('fill', '#543E2E')
        .text((d) => {
          if (d.soldOutCount > 0) {
            return `${d.totalCount}개 (${d.percentage}%) · 품절${d.soldOutCount}`;
          }
          return `${d.totalCount}개 (${d.percentage}%)`;
        });

      // Bottom X-axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(
          d3.axisBottom(xScale)
            .ticks(Math.min(maxCount, 6))
            .tickFormat((v) => `${v}개`)
        )
        .call((axis) => axis.select('.domain').attr('stroke', '#D9D3C7'))
        .selectAll('text')
        .style('font-size', '9.5px')
        .style('fill', '#78716C');

    } else {
      // Donut Chart Mode
      const radius = Math.min(width, height) / 2 - 16;
      const innerRadius = radius * 0.55;

      const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

      const pie = d3.pie<CategoryStat>()
        .value((d) => d.totalCount)
        .sort(null);

      const arc = d3.arc<d3.PieArcDatum<CategoryStat>>()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .cornerRadius(3);

      const hoverArc = d3.arc<d3.PieArcDatum<CategoryStat>>()
        .innerRadius(innerRadius - 2)
        .outerRadius(radius + 6)
        .cornerRadius(4);

      const arcs = g.selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .style('cursor', 'pointer')
        .on('mouseenter', (_, d) => setHoveredCategory(d.data))
        .on('mouseleave', () => setHoveredCategory(null))
        .on('click', (_, d) => onSelectCategory && onSelectCategory(d.data.category));

      arcs.append('path')
        .attr('d', arc)
        .attr('fill', (d) => colorScale(d.data.category))
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 2)
        .attr('opacity', (d) => (selectedCategory && selectedCategory !== d.data.category ? 0.4 : 0.95))
        .on('mouseenter', function (this: SVGPathElement, _, d) {
          d3.select(this).transition().duration(150).attr('d', hoverArc as any);
        })
        .on('mouseleave', function (this: SVGPathElement, _, d) {
          d3.select(this).transition().duration(150).attr('d', arc as any);
        });

      // Center summary text inside donut
      const totalCountSum = data.reduce((sum, d) => sum + d.totalCount, 0);
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.2em')
        .style('font-size', '10px')
        .style('font-weight', '600')
        .style('fill', '#78716C')
        .text('전체 메뉴');

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .style('font-size', '16px')
        .style('font-weight', '800')
        .style('fill', '#1C1917')
        .text(`${totalCountSum}개`);
    }
  }, [data, chartType, colorScale, selectedCategory, isExpanded]);

  // Top inventory recommendation insight
  const topCategory = data[0];
  const totalSoldOut = data.reduce((acc, cur) => acc + cur.soldOutCount, 0);

  return (
    <section className="bg-white rounded-2xl p-3.5 sm:p-4 border border-brand-border shadow-card space-y-3">
      {/* Header with Title and Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-terracotta flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 text-brand-terracotta" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-brand-dark">
                카테고리별 메뉴 비중 및 식자재 재고 계획 차트
              </h3>
              <span className="text-[10px] font-bold text-brand-terracotta bg-brand-sand px-1.5 py-0.2 rounded">
                D3.js 분석
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-brand-muted">
              현재 활성 메뉴 수량을 바탕으로 일일 식재료 사전 소진율 및 우선 발주군을 산출합니다.
            </p>
          </div>
        </div>

        {/* View & Sort Controls */}
        <div className="flex items-center space-x-1.5 text-xs">
          {/* Chart Type Segmented Toggle */}
          <div className="inline-flex rounded-lg p-0.5 bg-stone-100 border border-stone-200">
            <button
              type="button"
              onClick={() => setChartType('bar')}
              title="막대 그래프 뷰"
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white text-brand-terracotta shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">막대형</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('donut')}
              title="도넛 비율 뷰"
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer ${
                chartType === 'donut'
                  ? 'bg-white text-brand-terracotta shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">비율형</span>
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-[11px] font-medium bg-stone-50 border border-brand-border rounded-lg px-2 py-1 text-stone-700 focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
          >
            <option value="count">수량 많은순</option>
            <option value="soldOut">품절 많은순</option>
            <option value="name">이름순</option>
          </select>

          {/* Collapse/Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] text-stone-500 hover:text-stone-800 px-2 py-1 rounded bg-stone-50 border border-stone-200 font-semibold"
          >
            {isExpanded ? '접기' : '분석 펼치기'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Main Chart Area */}
          <div ref={containerRef} className="w-full relative overflow-x-auto min-h-[200px]">
            <svg ref={svgRef} className="w-full h-auto block" />

            {/* Hover Tooltip Overlay */}
            {hoveredCategory && (
              <div className="mt-2 p-2.5 rounded-xl bg-stone-900 text-white text-xs shadow-lg flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: colorScale(hoveredCategory.category) }}
                  />
                  <span className="font-bold text-sm">
                    {hoveredCategory.category}
                  </span>
                  <span className="text-stone-300">
                    전체 메뉴 중 {hoveredCategory.percentage}% ({hoveredCategory.totalCount}개)
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span>정상 판매: <b className="text-emerald-400">{hoveredCategory.availableCount}개</b></span>
                  {hoveredCategory.soldOutCount > 0 && (
                    <span>품절: <b className="text-red-400">{hoveredCategory.soldOutCount}개</b></span>
                  )}
                  <span>평균 단가: <b>{hoveredCategory.avgPrice.toLocaleString()}원</b></span>
                  {hoveredCategory.bestCount > 0 && (
                    <span className="text-red-300 font-bold">BEST {hoveredCategory.bestCount}개</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Inventory Planning Guide Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
            {/* 1. Core Focus Category */}
            <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-brand-terracotta font-bold text-[11px]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>주력 준비 카테고리</span>
              </div>
              {topCategory ? (
                <>
                  <p className="font-extrabold text-brand-dark text-xs sm:text-sm">
                    '{topCategory.category}' 라인업 ({topCategory.totalCount}개, {topCategory.percentage}%)
                  </p>
                  <p className="text-[10px] text-stone-600 leading-snug">
                    가장 많은 비중을 차지하므로 밥, 기본 찬, 주재료의 60% 이상을 당일 오전 사전 소분 준비 권장합니다.
                  </p>
                </>
              ) : (
                <p className="text-stone-400">데이터 없음</p>
              )}
            </div>

            {/* 2. Sold-Out & Restock Alert */}
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              totalSoldOut > 0 ? 'bg-red-50/70 border-red-200' : 'bg-emerald-50/70 border-emerald-200'
            }`}>
              <div className="flex items-center space-x-1.5 font-bold text-[11px]">
                {totalSoldOut > 0 ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-red-700">식자재 소진 및 재입고 필요</span>
                  </>
                ) : (
                  <>
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-800">모든 품목 재고 정상</span>
                  </>
                )}
              </div>
              <p className="font-extrabold text-stone-800 text-xs sm:text-sm">
                {totalSoldOut > 0 ? `현재 ${totalSoldOut}개 메뉴 품절 중` : '품절 메뉴 없음 (100% 정상 판매)'}
              </p>
              <p className="text-[10px] text-stone-600 leading-snug">
                {totalSoldOut > 0
                  ? '품절 처리된 카테고리의 신선육류 및 전처리 채소 발주 수량을 우선 보충하세요.'
                  : '전체 카테고리가 원활하게 판매되고 있어 적정 안전재고가 유지되고 있습니다.'}
              </p>
            </div>

            {/* 3. Click to Filter Guidance */}
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center space-x-1.5 text-stone-700 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>재고 연동 팁</span>
              </div>
              <p className="font-bold text-stone-800 text-[11px]">
                차트의 막대를 클릭하면 해당 카테고리로 필터링됩니다.
              </p>
              <div className="flex items-center space-x-2 pt-0.5 text-[10px] text-stone-500">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-xs bg-[#C25E3E]" />
                  <span>정상 판매</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-xs bg-red-500" />
                  <span>품절/소진</span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
