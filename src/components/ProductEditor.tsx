import React, { useRef, useState, useEffect } from "react";
import {
  UploadCloud,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
  Type,
} from "lucide-react";
import { toBlob } from "html-to-image";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Product, Color } from "./merch-widget-v2/types";

// --- КОНФИГУРАЦИЯ API ---
const API_BASE_URL = "https://wardrobe-back-production.up.railway.app";
// const API_BASE_URL = "http://localhost:3000";

// Временно отключили выбор области нанесения.
// Если понадобится вернуть, можно восстановить PRINT_AREAS и UI кнопки выбора зоны.

const PRINT_TYPES = [
  { id: "DTF3", label: "DTF Печать (Яркая, пленка)" },
  { id: "B2", label: "Шелкография (Пластизоль)" },
  { id: "D2", label: "Шелкография с трансфером" },
  { id: "F1", label: "Термопленка (Flex)" },
  { id: "DTG2", label: "Прямая печать (DTG)" },
];

const FONT_OPTIONS = [
  { label: "Inter", value: '"Inter", sans-serif' },
  { label: "Bebas Neue", value: '"Bebas Neue", sans-serif' },
  { label: "Pacifico", value: '"Pacifico", cursive' },
];

const TEXT_COLORS = [
  { id: "white", hex: "#FFFFFF" },
  { id: "black", hex: "#000000" },
  { id: "red", hex: "#EF4444" },
  { id: "neon", hex: "#39FF14" },
];

export const ProductEditor: React.FC<{
  products: Product[];
  onBack: () => void;
}> = ({ products, onBack }) => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Ищем продукт и цвет из роутера
  const initialProduct =
    products.find((p) => p.id === productId) || products[0];
  const colorIdFromState = location.state?.colorId;
  const initialColor =
    initialProduct?.colors.find((c) => c.id === colorIdFromState) ||
    initialProduct?.colors[0];

  // --- СОСТОЯНИЯ КОНСТРУКТОРА ---
  const [selectedProduct, setSelectedProduct] =
    useState<Product>(initialProduct);
  const [selectedColor, setSelectedColor] = useState<Color>(initialColor);
  const [printType, setPrintType] = useState(PRINT_TYPES[0].id);
  const [modelGender, setModelGender] = useState<"man" | "woman">("man");

  // Обновляем стейт, если изменился URL
  useEffect(() => {
    const p = products.find((p) => p.id === productId) || products[0];
    if (p) {
      setSelectedProduct(p);
      const c = p.colors.find((c) => c.id === colorIdFromState) || p.colors[0];
      setSelectedColor(c);
    }
  }, [productId, colorIdFromState, products]);

  // Стейт для логотипа
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState<number>(100);
  const [logoPos, setLogoPos] = useState({ x: 50, y: 50 }); // в процентах внутри зоны

  // Стейт для текста
  const [customText, setCustomText] = useState<string>("");
  const [textFont, setTextFont] = useState<string>(FONT_OPTIONS[0].value);
  const [textColor, setTextColor] = useState<string>(TEXT_COLORS[0].hex);
  const [textScale, setTextScale] = useState<number>(100);
  const [textPos, setTextPos] = useState({ x: 50, y: 50 }); // в процентах внутри зоны

  // Стейт для AI Мокапа
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMockupUrl, setGeneratedMockupUrl] = useState<string | null>(
    null,
  );

  // Ссылки
  const previewRef = useRef<HTMLDivElement>(null);
  const dragTarget = useRef<"text" | "logo" | null>(null);

  // --- ОБРАБОТЧИКИ СОБЫТИЙ ---
  const handleProductChange = (newProductId: string) => {
    const product = products.find((p) => p.id === newProductId) || products[0];
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]);
    // Опционально: обновляем URL
    navigate(`/editor/${product.id}`, {
      state: { colorId: product.colors[0].id },
      replace: true,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
      setLogoScale(100);
      setLogoPos({ x: 50, y: 50 });
    }
  };

  // --- DRAG AND DROP (ПО ВСЕМУ ПРЕВЬЮ) ---
  const handleMouseDown =
    (target: "text" | "logo") => (e: React.MouseEvent) => {
      e.preventDefault();
      dragTarget.current = target;
    };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragTarget.current || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();

    // Вычисляем позицию мыши относительно зоны в процентах
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    // Ограничиваем перемещение строго внутри зоны (0% - 100%)
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    if (dragTarget.current === "text") {
      setTextPos({ x, y });
    } else if (dragTarget.current === "logo") {
      setLogoPos({ x, y });
    }
  };

  const handleMouseUp = () => {
    dragTarget.current = null;
  };

  // --- ГЕНЕРАЦИЯ AI МОКАПА ---
  const handleGenerateMockup = async () => {
    if (!previewRef.current) return;

    let imageBlob: Blob | null = null;

    try {
      // 2. Делаем снимок блока предпросмотра (2D-эскиз + наложенный дизайн) ДО включения лоадера
      imageBlob = await toBlob(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
      });

      if (!imageBlob) {
        throw new Error("Не удалось создать снимок мокапа");
      }
    } catch (error) {
      console.error("Ошибка при создании снимка:", error);
      alert("Не удалось создать снимок для отправки.");
      return;
    }

    // Включаем лоадер отправки
    setIsGenerating(true);

    try {
      // Бэкенд принимает только эти поля
      const formData = new FormData();

      formData.append("garmentImage", imageBlob, "composed-garment.png");
      formData.append("modelGender", modelGender);
      formData.append("printType", printType);

      console.log("=========================================");
      console.log("🚀 ОТПРАВКА ЗАПРОСА НА БЭКЕНД");
      console.log(`URL: ${API_BASE_URL}/api/apply-print`);
      console.log("Метод: POST");
      console.log("Данные (FormData):");
      for (let [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          console.log(
            ` - [${key}]: Файл (Blob), размер: ${value.size} байт, тип: ${value.type}`,
          );
          if (key === "garmentImage") {
            const debugUrl = URL.createObjectURL(value);
            console.log(`   👀 ССЫЛКА НА ОТПРАВЛЯЕМУЮ КАРТИНКУ: ${debugUrl}`);
          }
        } else {
          console.log(` - [${key}]: "${value}"`);
        }
      }
      console.log("=========================================");

      // Отправляем запрос на бэкенд через axios
      const response = await axios.post(
        `${API_BASE_URL}/api/apply-print`,
        formData,
        {
          responseType: "blob",
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      console.log("--- ОТВЕТ ОТ БЭКЕНДА ---");
      console.log("Status:", response.status, response.statusText);

      // Получаем бинарные данные картинки и создаем URL
      const resultBlob = response.data;
      const imageUrl = URL.createObjectURL(resultBlob);
      setGeneratedMockupUrl(imageUrl);
    } catch (error: any) {
      console.error("--- ПОЛНАЯ ОШИБКА ---", error);
      let errorMessage = "Неизвестная ошибка";
      if (axios.isAxiosError(error) && error.response) {
        try {
          const errorText = await error.response.data.text();
          const errorJson = JSON.parse(errorText);
          errorMessage =
            errorJson.error || `Ошибка сервера: ${error.response.status}`;
        } catch (e) {
          errorMessage = `Ошибка сервера: ${error.response.status}`;
        }
      } else {
        errorMessage = error instanceof Error ? error.message : String(error);
      }
      alert("Упс, ошибка: " + errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 flex flex-col">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Pacifico&display=swap');`}
      </style>

      {/* Навигация */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm font-medium text-gray-600 hover:text-slate-900 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Назад в каталог
          </button>
          <div className="font-bold text-lg tracking-tight">
            B2B Merch Studio
          </div>
          <div className="w-24"></div> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 w-full flex-1 flex flex-col lg:flex-row gap-8 items-start">
        {/* ЛЕВАЯ КОЛОНКА: ЗОНА ПРЕДПРОСМОТРА */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-200">
            <div
              ref={previewRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative w-full aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center"
            >
              {/* Лоадер */}
              {isGenerating && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-indigo-900 font-medium animate-pulse">
                    Генерация 3D-мокапа...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Ожидайте 5-15 секунд
                  </p>
                </div>
              )}

              {/* Результат AI */}
              {generatedMockupUrl && (
                <div className="absolute inset-0 z-40 bg-white flex items-center justify-center">
                  <img
                    src={generatedMockupUrl}
                    alt="AI Mockup"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(generatedMockupUrl);
                      setGeneratedMockupUrl(null);
                    }}
                    className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-medium text-slate-900 hover:bg-white transition-colors shadow-md border border-gray-200"
                  >
                    Вернуться к 2D-эскизу
                  </button>
                </div>
              )}

              {/* 2D Эскиз (Базовая картинка) */}
              <img
                src={selectedColor.image}
                alt="Garment Flat"
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
              />

              {/* Логотип */}
              {logoUrl && (
                <div
                  onMouseDown={handleMouseDown("logo")}
                  className="absolute z-30 flex items-center justify-center p-1 rounded pointer-events-auto cursor-move hover:ring-2 hover:ring-indigo-500/50"
                  style={{
                    top: `${logoPos.y}%`,
                    left: `${logoPos.x}%`,
                    transform: "translate(-50%, -50%)",
                    width: "20%",
                  }}
                >
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-auto object-contain pointer-events-none"
                    style={{ transform: `scale(${logoScale / 100})` }}
                  />
                </div>
              )}

              {/* Текст */}
              {customText && (
                <div
                  onMouseDown={handleMouseDown("text")}
                  className="absolute z-30 flex items-center justify-center p-1 rounded pointer-events-auto cursor-move hover:ring-2 hover:ring-indigo-500/50"
                  style={{
                    top: `${textPos.y}%`,
                    left: `${textPos.x}%`,
                    transform: `translate(-50%, -50%) scale(${textScale / 100})`,
                    width: "30%",
                    color: textColor,
                    fontFamily: textFont,
                    textAlign: "center",
                    whiteSpace: "pre-wrap",
                    fontSize: "clamp(12px, 3vw, 24px)",
                    fontWeight: textFont.includes("Pacifico")
                      ? "normal"
                      : "bold",
                    lineHeight: "1.2",
                  }}
                >
                  {customText}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: ПАНЕЛЬ УПРАВЛЕНИЯ */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-6 pb-12">
          {/* ШАГ 1: Базовые настройки */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                1. Выбор изделия
              </h2>

              {/* Каталог */}
              <select
                value={selectedProduct.id}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white cursor-pointer font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Цвет */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Цвет изделия
              </h3>
              <div className="flex flex-wrap gap-3">
                {selectedProduct.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                    className={`w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center focus:outline-none overflow-hidden bg-slate-50 ${
                      selectedColor.id === c.id
                        ? "border-indigo-500 scale-110 shadow-md"
                        : "border-gray-200 hover:scale-105 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ШАГ 2: Нанесение */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">
              2. Параметры нанесения
            </h2>

            {/* Временно отключили выбор области нанесения.
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Область печати
              </h3>
              ...
            </div>
            */}

            {/* Тип печати */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Технология печати
              </h3>
              <select
                value={printType}
                onChange={(e) => setPrintType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white cursor-pointer"
              >
                {PRINT_TYPES.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Пол модели (AI) */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Пол модели (AI)
              </h3>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setModelGender("man")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    modelGender === "man"
                      ? "bg-white text-indigo-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Мужчина
                </button>
                <button
                  onClick={() => setModelGender("woman")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    modelGender === "woman"
                      ? "bg-white text-indigo-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Женщина
                </button>
              </div>
            </div>
          </div>

          {/* ШАГ 3: Дизайн */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">3. Ваш дизайн</h2>

            {/* Логотип */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Логотип
              </h3>
              {!logoUrl ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group">
                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors mb-2" />
                  <span className="text-sm font-medium text-slate-600">
                    Загрузить PNG / SVG
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".svg,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                  />
                </label>
              ) : (
                <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 p-1 flex items-center justify-center">
                        <img
                          src={logoUrl}
                          alt="Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Логотип загружен
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setLogoUrl(null);
                      }}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Масштаб</span>
                      <span>{logoScale}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="200"
                      value={logoScale}
                      onChange={(e) => setLogoScale(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="h-px w-full bg-gray-100" />

            {/* Текст */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Type className="w-4 h-4" /> Текст
              </h3>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Введите надпись..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <select
                  value={textFont}
                  onChange={(e) => setTextFont(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option
                      key={font.label}
                      value={font.value}
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 items-center justify-end">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setTextColor(c.hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${textColor === c.hex ? "border-indigo-500 scale-110" : "border-gray-200 hover:scale-105"}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Размер текста</span>
                  <span>{textScale}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={textScale}
                  onChange={(e) => setTextScale(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* ШАГ 4: Генерация */}
          <button
            onClick={handleGenerateMockup}
            disabled={isGenerating || (!logoUrl && !customText)}
            className="w-full bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{" "}
                Создаем магию...
              </>
            ) : (
              "Сгенерировать 3D-мокап"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;
