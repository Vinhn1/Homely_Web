import React, { useEffect, useState, useCallback } from 'react';
import axios from '@/api/axios';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    Flag, Check, X, Loader, ChevronLeft, ChevronRight,
    Package, Home, User, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = '/admin';

const FILTER_TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xử lý' },
    { key: 'resolved', label: 'Đã giải quyết' },
    { key: 'dismissed', label: 'Đã bỏ qua' },
];

const STATUS_CONFIG = {
    pending: { label: 'Chờ xử lý', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    resolved: { label: 'Đã giải quyết', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    dismissed: { label: 'Đã bỏ qua', cls: 'bg-slate-700 text-slate-400 border-slate-600' },
};

const AdminReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [processingId, setProcessingId] = useState(null);
    const [actionModal, setActionModal] = useState(null); // { reportId, type: 'resolve'|'dismiss' }
    const [adminNote, setAdminNote] = useState('');

    const fetchReports = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 15 });
            if (activeTab !== 'all') params.set('status', activeTab);

            const res = await axios.get(`${API_BASE}/reports?${params}`);
            setReports(res.data.data);
            setPagination(res.data.pagination);
        } catch {
            toast.error('Không thể tải danh sách báo cáo');
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { fetchReports(1); }, [fetchReports]);

    const handleAction = async () => {
        if (!actionModal) return;
        const { reportId, type } = actionModal;
        setProcessingId(reportId);
        try {
            await axios.patch(`${API_BASE}/reports/${reportId}/${type}`, { adminNote });
            toast.success(type === 'resolve' ? '✅ Đã đánh dấu là đã giải quyết.' : 'Đã bỏ qua báo cáo.');
            setActionModal(null);
            setAdminNote('');
            fetchReports(pagination.page);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Flag className="w-7 h-7 text-rose-400" /> Báo cáo Vi phạm
                </h1>
                <p className="text-slate-500 mt-1 text-sm">{pagination.total} báo cáo</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-800/60 border border-white/10 p-1 rounded-xl w-fit">
                {FILTER_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === tab.key ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Reports List */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader className="w-6 h-6 animate-spin text-rose-400" />
                    </div>
                ) : reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 bg-slate-800/30 border border-white/5 rounded-2xl">
                        <Package className="w-12 h-12 text-slate-700" />
                        <p className="text-slate-500 text-sm font-medium">Không có báo cáo nào</p>
                    </div>
                ) : reports.map(report => {
                    const statusConf = STATUS_CONFIG[report.status];
                    const isProperty = report.targetType === 'property';
                    const target = report.targetId;
                    return (
                        <div key={report._id} className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 hover:bg-slate-800 transition-all">
                            <div className="flex items-start gap-4">
                                {/* Reporter */}
                                <div className="shrink-0">
                                    {report.reporter?.avatarUrl ? (
                                        <img src={report.reporter.avatarUrl} className="w-10 h-10 rounded-xl object-cover" alt="" />
                                    ) : (
                                        <div className="w-10 h-10 bg-rose-600/50 rounded-xl flex items-center justify-center text-white font-black text-sm">
                                            {report.reporter?.displayName?.charAt(0) || '?'}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            {/* Meta */}
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${statusConf.cls}`}>{statusConf.label}</span>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isProperty ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'}`}>
                                                    {isProperty ? '🏠 Tin đăng' : '👤 Người dùng'}
                                                </span>
                                            </div>
                                            <p className="text-white font-bold text-sm">
                                                <span className="text-slate-400 font-medium">Báo cáo bởi</span> {report.reporter?.displayName}
                                            </p>
                                            <p className="text-slate-500 text-xs mt-0.5">
                                                {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: vi })}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        {report.status === 'pending' && (
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => setActionModal({ reportId: report._id, type: 'resolve' })}
                                                    disabled={!!processingId}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-black hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                                                >
                                                    {processingId === report._id ? <Loader className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                                    Giải quyết
                                                </button>
                                                <button
                                                    onClick={() => setActionModal({ reportId: report._id, type: 'dismiss' })}
                                                    disabled={!!processingId}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 border border-white/10 text-slate-400 rounded-lg text-xs font-black hover:bg-slate-600 transition-all disabled:opacity-50"
                                                >
                                                    <X className="w-3 h-3" /> Bỏ qua
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reason */}
                                    <div className="mt-3 p-3 bg-slate-900/50 rounded-xl">
                                        <p className="text-rose-400 text-xs font-black mb-1 uppercase tracking-widest">Lý do báo cáo</p>
                                        <p className="text-slate-300 text-sm font-medium">{report.reason}</p>
                                        {report.description && (
                                            <p className="text-slate-500 text-xs mt-1.5 italic">"{report.description}"</p>
                                        )}
                                    </div>

                                    {/* Target Info */}
                                    {target && (
                                        <div className="mt-3 flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                                            {isProperty ? (
                                                <>
                                                    {target.images?.[0] && (
                                                        <img src={target.images[0]} className="w-10 h-10 rounded-lg object-cover shrink-0" alt="" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-slate-300 text-xs font-bold truncate">{target.title || 'Tin đăng đã xóa'}</p>
                                                        <p className="text-slate-600 text-[10px]">{target.location?.city}</p>
                                                    </div>
                                                    {target._id && (
                                                        <Link to={`/property/${target._id}`} target="_blank" className="text-violet-400 hover:text-violet-300 transition-colors shrink-0">
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </Link>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 bg-violet-600/50 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0">
                                                        {target.displayName?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-slate-300 text-xs font-bold truncate">{target.displayName}</p>
                                                        <p className="text-slate-600 text-[10px] truncate">{target.email}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Admin Note */}
                                    {report.adminNote && (
                                        <div className="mt-3 p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl">
                                            <p className="text-violet-400 text-[10px] font-black uppercase tracking-widest mb-1">Ghi chú Admin</p>
                                            <p className="text-slate-400 text-xs">{report.adminNote}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-slate-500 text-xs">Trang {pagination.page} / {pagination.totalPages}</p>
                    <div className="flex gap-2">
                        <button onClick={() => fetchReports(pagination.page - 1)} disabled={pagination.page <= 1} className="w-8 h-8 bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-600 disabled:opacity-30 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => fetchReports(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="w-8 h-8 bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-600 disabled:opacity-30 transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Action Modal */}
            {actionModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-white font-black text-xl mb-2">
                            {actionModal.type === 'resolve' ? '✅ Giải quyết báo cáo' : '⛔ Bỏ qua báo cáo'}
                        </h3>
                        <p className="text-slate-400 text-sm mb-5">
                            {actionModal.type === 'resolve'
                                ? 'Xác nhận báo cáo hợp lệ và đã được xử lý. Nhập ghi chú (tùy chọn).'
                                : 'Đánh dấu báo cáo này là không hợp lệ và bỏ qua.'}
                        </p>
                        <textarea
                            value={adminNote}
                            onChange={e => setAdminNote(e.target.value)}
                            placeholder="Ghi chú xử lý (tùy chọn)..."
                            rows={3}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 resize-none focus:outline-none focus:border-violet-500/50"
                        />
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => { setActionModal(null); setAdminNote(''); }} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-all text-sm">Hủy</button>
                            <button
                                onClick={handleAction}
                                disabled={!!processingId}
                                className={`flex-1 py-3 rounded-xl text-white font-black transition-all text-sm disabled:opacity-50 ${actionModal.type === 'resolve' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-600 hover:bg-slate-500'}`}
                            >
                                {processingId ? 'Đang xử lý...' : actionModal.type === 'resolve' ? 'Xác nhận' : 'Bỏ qua'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage;
