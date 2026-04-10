import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
    ArrowLeft, ArrowRight, Check, Upload, X, Home,
    MapPin, Wifi, Wind, Refrigerator, Car, Layers, Dumbbell,
    WashingMachine, Camera, ChevronRight, Loader
} from 'lucide-react';

const AMENITY_OPTIONS = [
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'air_conditioner', label: 'Máy lạnh', icon: Wind },
    { key: 'refrigerator', label: 'Tủ lạnh', icon: Refrigerator },
    { key: 'parking', label: 'Bãi đỗ xe', icon: Car },
    { key: 'elevator', label: 'Thang máy', icon: Layers },
    { key: 'gym', label: 'Phòng GYM', icon: Dumbbell },
    { key: 'washing_machine', label: 'Máy giặt', icon: WashingMachine },
    { key: 'camera', label: 'Camera an ninh', icon: Camera },
];

const PROPERTY_TYPES = ['Phòng trọ', 'Căn hộ', 'Nhà nguyên căn', 'Chung cư'];
const CITIES = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Vĩnh Long', 'Đồng Nai', 'Bình Dương'];
const LEASE_TERMS = ['1 Tháng', '3 Tháng', '6 Tháng', '12 Tháng', '24 Tháng'];

const STEPS = ['Thông tin cơ bản', 'Địa chỉ & Chi tiết', 'Hình ảnh & Đăng tin'];

const PostPropertyPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        propertyType: 'Phòng trọ',
        area: '',
        bedroom: 1,
        bathroom: 1,
        floor: 1,
        minLease: '6 Tháng',
        capacity: 2,
        security: '24/7',
        legalDocs: 'Hợp đồng thuê',
        amenities: [],
        'location.address': '',
        'location.city': 'Hồ Chí Minh',
        'location.district': '',
    });

    const [images, setImages] = useState([]); // { file, preview }

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const toggleAmenity = (key) => {
        setForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(key)
                ? prev.amenities.filter(a => a !== key)
                : [...prev.amenities, key]
        }));
    };

    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files);
        const remaining = 10 - images.length;
        if (remaining <= 0) return toast.warning('Đã đạt giới hạn 10 ảnh!');

        const newImages = files.slice(0, remaining).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    // Drag & Drop
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        const remaining = 10 - images.length;
        const newImages = files.slice(0, remaining).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    }, [images]);

    const validateStep = () => {
        if (currentStep === 0) {
            if (!form.title.trim()) return toast.error('Vui lòng nhập tiêu đề tin đăng!');
            if (form.title.length < 10) return toast.error('Tiêu đề phải có ít nhất 10 ký tự!');
            if (!form.description.trim()) return toast.error('Vui lòng nhập mô tả!');
            if (!form.price || Number(form.price) <= 0) return toast.error('Vui lòng nhập giá hợp lệ!');
            if (!form.area || Number(form.area) <= 0) return toast.error('Vui lòng nhập diện tích!');
            return true;
        }
        if (currentStep === 1) {
            if (!form['location.address'].trim()) return toast.error('Vui lòng nhập địa chỉ!');
            return true;
        }
        if (currentStep === 2) {
            if (images.length < 3) return toast.error('Vui lòng tải lên ít nhất 3 ảnh!');
            return true;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) setCurrentStep(s => Math.min(s + 1, 2));
    };
    const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (key === 'amenities') {
                    value.forEach(a => formData.append('amenities', a));
                } else {
                    formData.append(key, value);
                }
            });
            images.forEach(img => formData.append('images', img.file));

            const token = localStorage.getItem('accessToken');
            await axios.post('http://localhost:5000/api/properties', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('🎉 Tin đăng đã được tạo thành công!');
            navigate('/dashboard/my-listings');

        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 text-sm font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                </button>
                <h1 className="text-3xl font-black text-slate-900">Đăng Tin Cho Thuê</h1>
                <p className="text-slate-500 mt-1">Điền đầy đủ thông tin để tin đăng của bạn nổi bật hơn</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    {STEPS.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${i < currentStep ? 'bg-emerald-500 text-white' : i === currentStep ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                                {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className={`text-sm font-bold hidden sm:block ${i === currentStep ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                            {i < STEPS.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-slate-200 mx-2" />
                            )}
                        </div>
                    ))}
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep) / (STEPS.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                {/* STEP 1: Thông tin cơ bản */}
                {currentStep === 0 && (
                    <div className="space-y-6">
                        <SectionLabel>Thông tin cơ bản</SectionLabel>

                        <div>
                            <Label>Loại bất động sản</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {PROPERTY_TYPES.map(type => (
                                    <button key={type} onClick={() => update('propertyType', type)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${form.propertyType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>Tiêu đề tin đăng <span className="text-red-400">*</span></Label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => update('title', e.target.value)}
                                maxLength={100}
                                placeholder="VD: Phòng trọ cao cấp gần ĐH, có gác lửng, full nội thất"
                                className="input-field"
                            />
                            <p className="text-xs text-slate-400 text-right mt-1">{form.title.length}/100</p>
                        </div>

                        <div>
                            <Label>Mô tả chi tiết <span className="text-red-400">*</span></Label>
                            <textarea
                                value={form.description}
                                onChange={e => update('description', e.target.value)}
                                rows={5}
                                placeholder="Mô tả chi tiết về phòng: vị trí, tiện ích xung quanh, đặc điểm nổi bật..."
                                className="input-field resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Giá thuê (VNĐ/tháng) <span className="text-red-400">*</span></Label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={e => update('price', e.target.value)}
                                        placeholder="3000000"
                                        className="input-field pr-16"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">VNĐ</span>
                                </div>
                            </div>
                            <div>
                                <Label>Diện tích (m²) <span className="text-red-400">*</span></Label>
                                <input
                                    type="number"
                                    value={form.area}
                                    onChange={e => update('area', e.target.value)}
                                    placeholder="25"
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: Địa chỉ & Chi tiết */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <SectionLabel>Địa chỉ & Chi tiết</SectionLabel>

                        <div>
                            <Label>Địa chỉ cụ thể <span className="text-red-400">*</span></Label>
                            <input
                                type="text"
                                value={form['location.address']}
                                onChange={e => update('location.address', e.target.value)}
                                placeholder="Số nhà, Tên đường, Phường/Xã"
                                className="input-field"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Quận/Huyện</Label>
                                <input
                                    type="text"
                                    value={form['location.district']}
                                    onChange={e => update('location.district', e.target.value)}
                                    placeholder="Quận 1, Bình Thạnh..."
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <Label>Thành phố</Label>
                                <select value={form['location.city']} onChange={e => update('location.city', e.target.value)} className="input-field">
                                    {CITIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label>Phòng ngủ</Label>
                                <NumberInput value={form.bedroom} onChange={v => update('bedroom', v)} min={0} max={10} />
                            </div>
                            <div>
                                <Label>Phòng tắm</Label>
                                <NumberInput value={form.bathroom} onChange={v => update('bathroom', v)} min={1} max={10} />
                            </div>
                            <div>
                                <Label>Tầng</Label>
                                <NumberInput value={form.floor} onChange={v => update('floor', v)} min={1} max={50} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Thời gian thuê tối thiểu</Label>
                                <select value={form.minLease} onChange={e => update('minLease', e.target.value)} className="input-field">
                                    {LEASE_TERMS.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Sức chứa (người)</Label>
                                <NumberInput value={form.capacity} onChange={v => update('capacity', v)} min={1} max={20} />
                            </div>
                        </div>

                        <div>
                            <Label>Tiện ích</Label>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                {AMENITY_OPTIONS.map(({ key, label, icon: Icon }) => (
                                    <button key={key} onClick={() => toggleAmenity(key)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-xs font-bold ${form.amenities.includes(key) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>
                                        <Icon className="w-5 h-5" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Hình ảnh */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <SectionLabel>Hình ảnh <span className="text-slate-400 font-normal text-sm">(tối thiểu 3, tối đa 10 ảnh)</span></SectionLabel>

                        {/* Drop Zone */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={e => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-blue-200 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                        >
                            <Upload className="w-10 h-10 text-blue-300 group-hover:text-blue-400 mx-auto mb-3 transition-colors" />
                            <p className="font-bold text-slate-600">Kéo & thả ảnh vào đây</p>
                            <p className="text-slate-400 text-sm mt-1">hoặc click để chọn từ máy tính</p>
                            <p className="text-xs text-slate-300 mt-2">JPG, PNG, WebP — Tối đa 5MB/ảnh</p>
                            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageAdd} className="hidden" />
                        </div>

                        {/* Image Preview Grid */}
                        {images.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-bold text-slate-600">{images.length}/10 ảnh đã chọn</p>
                                    {images.length >= 3 && (
                                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                            <Check className="w-3.5 h-3.5" /> Đủ điều kiện đăng
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                                            <img src={img.preview} alt="" className="w-full h-full object-cover" />
                                            {i === 0 && (
                                                <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                                    Ảnh bìa
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        <div className="bg-slate-50 rounded-2xl p-5 space-y-2">
                            <h3 className="font-black text-slate-900 mb-3">Tóm tắt tin đăng</h3>
                            <InfoRow label="Loại BĐS" value={form.propertyType} />
                            <InfoRow label="Tiêu đề" value={form.title || '—'} />
                            <InfoRow label="Giá" value={form.price ? `${Number(form.price).toLocaleString('vi-VN')} VNĐ/tháng` : '—'} />
                            <InfoRow label="Diện tích" value={form.area ? `${form.area} m²` : '—'} />
                            <InfoRow label="Địa chỉ" value={form['location.address'] ? `${form['location.address']}, ${form['location.city']}` : '—'} />
                            <InfoRow label="Tiện ích" value={form.amenities.length > 0 ? form.amenities.length + ' tiện ích' : 'Chưa chọn'} />
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                </button>

                {currentStep < 2 ? (
                    <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
                        Tiếp theo <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        {isSubmitting ? 'Đang đăng tin...' : 'Đăng Tin Ngay'}
                    </button>
                )}
            </div>
        </div>
    );
};

// Helpers
const Label = ({ children }) => <label className="block text-sm font-black text-slate-700 mb-1.5">{children}</label>;
const SectionLabel = ({ children }) => <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-50">{children}</h2>;
const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="font-bold text-slate-700 truncate max-w-[60%] text-right">{value}</span>
    </div>
);
const NumberInput = ({ value, onChange, min = 0, max = 99 }) => (
    <div className="flex items-center border-2 border-slate-100 rounded-xl overflow-hidden">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="px-4 py-3 text-slate-400 hover:bg-slate-50 font-black text-lg transition-colors">—</button>
        <span className="flex-1 text-center font-black text-slate-900">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="px-4 py-3 text-slate-400 hover:bg-slate-50 font-black text-lg transition-colors">+</button>
    </div>
);

export default PostPropertyPage;
