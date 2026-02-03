import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, PieChart, Pie } from 'recharts';
import { Star, TrendingUp, TrendingDown, Filter, ChevronDown, ChevronUp, MapPin, Activity, Users, Award, AlertCircle, CheckCircle } from 'lucide-react';

// ============================================
// MEDICARE STAR RATINGS DASHBOARD
// For Healthcare Professionals
// ============================================

// Sample data based on CMS Medicare Advantage STAR Rating categories
const healthPlansData = [
  { id: 1, name: "HealthFirst Advantage", state: "CA", region: "West", overallRating: 4.5, healthServices: 4, drugServices: 5, memberExperience: 4.5, complaints: 4, customerService: 5, enrollment: 245000, trend: "up", yoyChange: 0.5 },
  { id: 2, name: "BlueCare Plus", state: "TX", region: "South", overallRating: 4, healthServices: 4, drugServices: 4, memberExperience: 4, complaints: 3.5, customerService: 4.5, enrollment: 312000, trend: "up", yoyChange: 0.25 },
  { id: 3, name: "Aetna Medicare Elite", state: "FL", region: "South", overallRating: 3.5, healthServices: 3.5, drugServices: 4, memberExperience: 3, complaints: 3, customerService: 4, enrollment: 189000, trend: "down", yoyChange: -0.5 },
  { id: 4, name: "UnitedHealth Senior", state: "NY", region: "Northeast", overallRating: 4.5, healthServices: 4.5, drugServices: 4.5, memberExperience: 5, complaints: 4, customerService: 4.5, enrollment: 520000, trend: "up", yoyChange: 0.5 },
  { id: 5, name: "Humana Gold Choice", state: "OH", region: "Midwest", overallRating: 4, healthServices: 4, drugServices: 3.5, memberExperience: 4.5, complaints: 4, customerService: 4, enrollment: 178000, trend: "stable", yoyChange: 0 },
  { id: 6, name: "Kaiser Senior Advantage", state: "CA", region: "West", overallRating: 5, healthServices: 5, drugServices: 4.5, memberExperience: 5, complaints: 5, customerService: 5, enrollment: 410000, trend: "up", yoyChange: 0.25 },
  { id: 7, name: "Cigna HealthSpring", state: "TN", region: "South", overallRating: 3, healthServices: 3, drugServices: 3.5, memberExperience: 2.5, complaints: 3, customerService: 3.5, enrollment: 95000, trend: "down", yoyChange: -0.25 },
  { id: 8, name: "Anthem MediBlue", state: "IN", region: "Midwest", overallRating: 3.5, healthServices: 3.5, drugServices: 4, memberExperience: 3.5, complaints: 3, customerService: 3.5, enrollment: 142000, trend: "up", yoyChange: 0.25 },
  { id: 9, name: "WellCare Value", state: "GA", region: "South", overallRating: 3, healthServices: 2.5, drugServices: 3, memberExperience: 3, complaints: 3.5, customerService: 3, enrollment: 203000, trend: "down", yoyChange: -0.5 },
  { id: 10, name: "Molina Complete Care", state: "WA", region: "West", overallRating: 4, healthServices: 4, drugServices: 4, memberExperience: 4, complaints: 4, customerService: 4.5, enrollment: 87000, trend: "up", yoyChange: 0.5 },
  { id: 11, name: "Centene Senior", state: "MO", region: "Midwest", overallRating: 3.5, healthServices: 3.5, drugServices: 3, memberExperience: 4, complaints: 3.5, customerService: 3.5, enrollment: 156000, trend: "stable", yoyChange: 0 },
  { id: 12, name: "SCAN Health Plan", state: "AZ", region: "West", overallRating: 4.5, healthServices: 4.5, drugServices: 4, memberExperience: 5, complaints: 4.5, customerService: 4.5, enrollment: 234000, trend: "up", yoyChange: 0.25 },
];

// Historical trend data (2020-2024)
const trendData = [
  { year: '2020', national: 3.8, west: 4.1, south: 3.5, midwest: 3.7, northeast: 4.0 },
  { year: '2021', national: 3.9, west: 4.2, south: 3.6, midwest: 3.8, northeast: 4.1 },
  { year: '2022', national: 4.0, west: 4.3, south: 3.7, midwest: 3.9, northeast: 4.2 },
  { year: '2023', national: 4.1, west: 4.4, south: 3.8, midwest: 4.0, northeast: 4.3 },
  { year: '2024', national: 4.2, west: 4.5, south: 3.9, midwest: 4.1, northeast: 4.4 },
];

// Regional summary data
const regionalData = [
  { region: 'West', avgRating: 4.5, planCount: 4, topPerformer: 'Kaiser Senior Advantage', totalEnrollment: 976000 },
  { region: 'South', avgRating: 3.4, planCount: 4, topPerformer: 'BlueCare Plus', totalEnrollment: 799000 },
  { region: 'Midwest', avgRating: 3.7, planCount: 3, topPerformer: 'Humana Gold Choice', totalEnrollment: 476000 },
  { region: 'Northeast', avgRating: 4.5, planCount: 1, topPerformer: 'UnitedHealth Senior', totalEnrollment: 520000 },
];

// Rating distribution
const ratingDistribution = [
  { rating: '5 Stars', count: 1, color: '#10b981' },
  { rating: '4-4.5 Stars', count: 6, color: '#6366f1' },
  { rating: '3-3.5 Stars', count: 4, color: '#f59e0b' },
  { rating: 'Below 3 Stars', count: 1, color: '#ef4444' },
];

// Vibrant color palette
const COLORS = {
  primary: '#6366f1',    // Indigo
  secondary: '#ec4899',  // Pink
  accent: '#14b8a6',     // Teal
  warning: '#f59e0b',    // Amber
  success: '#10b981',    // Emerald
  danger: '#ef4444',     // Red
  purple: '#8b5cf6',     // Purple
  blue: '#3b82f6',       // Blue
  gradient: ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b'],
};

// Star Rating Component
const StarRating = ({ rating, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < fullStars
              ? 'fill-yellow-400 text-yellow-400'
              : i === fullStars && hasHalf
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="ml-2 font-bold text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4" style={{ borderColor: color }}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
    {trend && (
      <div className={`flex items-center mt-3 text-sm ${trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
        {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : trend < 0 ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
        <span>{trend > 0 ? '+' : ''}{trend} vs last year</span>
      </div>
    )}
  </div>
);

// Regional Map Component (Simplified visual representation)
const RegionalMap = ({ data, selectedRegion, onRegionSelect }) => {
  const regionPositions = {
    'West': { x: 15, y: 40, width: 25, height: 50 },
    'Midwest': { x: 40, y: 30, width: 25, height: 40 },
    'South': { x: 40, y: 70, width: 30, height: 25 },
    'Northeast': { x: 70, y: 25, width: 20, height: 30 },
  };

  const getRegionColor = (region) => {
    const regionData = data.find(r => r.region === region);
    if (!regionData) return '#e5e7eb';
    const rating = regionData.avgRating;
    if (rating >= 4.5) return COLORS.success;
    if (rating >= 4) return COLORS.primary;
    if (rating >= 3.5) return COLORS.warning;
    return COLORS.danger;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-indigo-500" />
        Regional Performance
      </h3>
      <svg viewBox="0 0 100 100" className="w-full h-64">
        {Object.entries(regionPositions).map(([region, pos]) => (
          <g key={region} onClick={() => onRegionSelect(region === selectedRegion ? null : region)} className="cursor-pointer">
            <rect
              x={pos.x}
              y={pos.y}
              width={pos.width}
              height={pos.height}
              rx="4"
              fill={getRegionColor(region)}
              opacity={selectedRegion && selectedRegion !== region ? 0.3 : 0.85}
              stroke={selectedRegion === region ? '#1f2937' : 'white'}
              strokeWidth={selectedRegion === region ? 2 : 1}
              className="transition-all duration-300 hover:opacity-100"
            />
            <text
              x={pos.x + pos.width / 2}
              y={pos.y + pos.height / 2 - 5}
              textAnchor="middle"
              className="text-xs font-bold fill-white pointer-events-none"
            >
              {region}
            </text>
            <text
              x={pos.x + pos.width / 2}
              y={pos.y + pos.height / 2 + 8}
              textAnchor="middle"
              className="text-xs fill-white pointer-events-none"
            >
              {data.find(r => r.region === region)?.avgRating.toFixed(1)}★
            </text>
          </g>
        ))}
      </svg>
      <div className="flex justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.success }}></div>
          <span>4.5+ Stars</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.primary }}></div>
          <span>4-4.5 Stars</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.warning }}></div>
          <span>3.5-4 Stars</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.danger }}></div>
          <span>&lt;3.5 Stars</span>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function MedicareStarDashboard() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'overallRating', direction: 'desc' });
  const [filterRating, setFilterRating] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Filter and sort plans
  const filteredPlans = useMemo(() => {
    let plans = [...healthPlansData];

    if (selectedRegion) {
      plans = plans.filter(p => p.region === selectedRegion);
    }

    if (filterRating !== 'all') {
      const minRating = parseFloat(filterRating);
      plans = plans.filter(p => p.overallRating >= minRating && p.overallRating < minRating + 1);
    }

    plans.sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    return plans;
  }, [selectedRegion, filterRating, sortConfig]);

  // Calculate summary metrics
  const metrics = useMemo(() => {
    const plans = selectedRegion
      ? healthPlansData.filter(p => p.region === selectedRegion)
      : healthPlansData;

    return {
      avgRating: (plans.reduce((sum, p) => sum + p.overallRating, 0) / plans.length).toFixed(1),
      totalEnrollment: plans.reduce((sum, p) => sum + p.enrollment, 0),
      highPerformers: plans.filter(p => p.overallRating >= 4).length,
      improvingPlans: plans.filter(p => p.trend === 'up').length,
    };
  }, [selectedRegion]);

  // Radar data for selected plan
  const radarData = selectedPlan ? [
    { metric: 'Health Services', value: selectedPlan.healthServices, fullMark: 5 },
    { metric: 'Drug Services', value: selectedPlan.drugServices, fullMark: 5 },
    { metric: 'Member Experience', value: selectedPlan.memberExperience, fullMark: 5 },
    { metric: 'Complaints', value: selectedPlan.complaints, fullMark: 5 },
    { metric: 'Customer Service', value: selectedPlan.customerService, fullMark: 5 },
  ] : [];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Medicare STAR Ratings Dashboard</h1>
              <p className="mt-2 text-indigo-100">CMS Quality Performance Analytics for Healthcare Professionals</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <p className="text-xs text-indigo-100">Data Period</p>
                <p className="font-semibold">2024 Plan Year</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <p className="text-xs text-indigo-100">Last Updated</p>
                <p className="font-semibold">Jan 15, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Avg Star Rating"
            value={`${metrics.avgRating}★`}
            subtitle={selectedRegion || 'National Average'}
            icon={Award}
            color={COLORS.primary}
            trend={0.2}
          />
          <MetricCard
            title="Total Enrollment"
            value={(metrics.totalEnrollment / 1000000).toFixed(2) + 'M'}
            subtitle="Medicare Advantage Members"
            icon={Users}
            color={COLORS.secondary}
            trend={null}
          />
          <MetricCard
            title="High Performers"
            value={metrics.highPerformers}
            subtitle="Plans with 4+ Stars"
            icon={CheckCircle}
            color={COLORS.success}
            trend={2}
          />
          <MetricCard
            title="Improving"
            value={metrics.improvingPlans}
            subtitle="Plans trending up YoY"
            icon={TrendingUp}
            color={COLORS.accent}
            trend={null}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Regional Map */}
          <div className="lg:col-span-1">
            <RegionalMap
              data={regionalData}
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
            />
          </div>

          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-pink-500" />
              Star Rating Trends (2020-2024)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fill: '#6b7280' }} />
                <YAxis domain={[3, 5]} tick={{ fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="national" name="National" stroke="#1f2937" strokeWidth={3} dot={{ fill: '#1f2937', r: 5 }} />
                <Line type="monotone" dataKey="west" name="West" stroke={COLORS.success} strokeWidth={2} dot={{ fill: COLORS.success, r: 4 }} />
                <Line type="monotone" dataKey="south" name="South" stroke={COLORS.warning} strokeWidth={2} dot={{ fill: COLORS.warning, r: 4 }} />
                <Line type="monotone" dataKey="midwest" name="Midwest" stroke={COLORS.primary} strokeWidth={2} dot={{ fill: COLORS.primary, r: 4 }} />
                <Line type="monotone" dataKey="northeast" name="Northeast" stroke={COLORS.secondary} strokeWidth={2} dot={{ fill: COLORS.secondary, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating Distribution & Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rating Distribution</h3>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {ratingDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.rating}</span>
                    </div>
                    <span className="font-bold text-gray-800">{item.count} plans</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Radar Chart for Selected Plan */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {selectedPlan ? `${selectedPlan.name} - Quality Breakdown` : 'Select a Plan to View Details'}
            </h3>
            {selectedPlan ? (
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fill: '#6b7280' }} />
                  <Radar
                    name={selectedPlan.name}
                    dataKey="value"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.5}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                <p>Click on a plan in the table below to see its quality breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Health Plans Comparison</h3>
              <div className="flex items-center gap-4">
                {selectedRegion && (
                  <button
                    onClick={() => setSelectedRegion(null)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Clear Region Filter
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4-4.9 Stars</option>
                    <option value="3">3-3.9 Stars</option>
                    <option value="2">Below 3 Stars</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'name', label: 'Plan Name' },
                    { key: 'state', label: 'State' },
                    { key: 'overallRating', label: 'Overall Rating' },
                    { key: 'healthServices', label: 'Health Services' },
                    { key: 'drugServices', label: 'Drug Services' },
                    { key: 'memberExperience', label: 'Member Exp.' },
                    { key: 'enrollment', label: 'Enrollment' },
                    { key: 'trend', label: 'YoY Trend' },
                  ].map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortConfig.key === col.key && (
                          sortConfig.direction === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`hover:bg-indigo-50 cursor-pointer transition-colors ${selectedPlan?.id === plan.id ? 'bg-indigo-50 ring-2 ring-indigo-200 ring-inset' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{plan.name}</div>
                      <div className="text-xs text-gray-500">{plan.region} Region</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {plan.state}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StarRating rating={plan.overallRating} size="sm" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        plan.healthServices >= 4 ? 'bg-emerald-100 text-emerald-700' :
                        plan.healthServices >= 3 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {plan.healthServices}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        plan.drugServices >= 4 ? 'bg-emerald-100 text-emerald-700' :
                        plan.drugServices >= 3 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {plan.drugServices}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        plan.memberExperience >= 4 ? 'bg-emerald-100 text-emerald-700' :
                        plan.memberExperience >= 3 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {plan.memberExperience}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 font-medium">
                      {(plan.enrollment / 1000).toFixed(0)}K
                    </td>
                    <td className="px-4 py-4">
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        plan.trend === 'up' ? 'text-emerald-600' :
                        plan.trend === 'down' ? 'text-red-500' :
                        'text-gray-500'
                      }`}>
                        {plan.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                        {plan.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                        {plan.trend === 'stable' && <span>—</span>}
                        <span>{plan.yoyChange > 0 ? '+' : ''}{plan.yoyChange}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
            Showing {filteredPlans.length} of {healthPlansData.length} plans
            {selectedRegion && ` • Filtered by: ${selectedRegion} Region`}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p className="mb-2">
            <strong>Data Source:</strong> Centers for Medicare & Medicaid Services (CMS) STAR Ratings Program
          </p>
          <p>
            This dashboard displays sample data for demonstration purposes.
            For official ratings, visit <a href="https://www.medicare.gov" className="text-indigo-600 hover:underline">Medicare.gov</a>
          </p>
        </footer>
      </main>
    </div>
  );
}
