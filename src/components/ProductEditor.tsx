import React, { useMemo, useState } from "react";
import { UploadCloud, Trash2 } from "lucide-react";
import { Product, Color } from "./merch-widget-v2/types";

interface ProductEditorProps {
  product: Product;
  initialColor: Color;
  onBack: () => void;
}

type ModelType = "man" | "woman" | "polo";

const MODEL_ASSETS = {
  man: {
    base: "/model777.png",
    mask: "/maska.png",
  },
  woman: {
    base: "https://n2b.su/static/images/woman.png",
    mask: "/mask-woman.png", // Заглушка для женской модели
  },
  polo: {
    base: "/modelishe.png",
    mask: "/topmaska.png",
  },
};

const FONT_OPTIONS = [
  { label: "Inter", value: '"Inter", sans-serif' },
  { label: "Roboto", value: '"Roboto", sans-serif' },
  { label: "Montserrat", value: '"Montserrat", sans-serif' },
  { label: "Pacifico", value: '"Pacifico", cursive' },
  { label: "Bebas Neue", value: '"Bebas Neue", sans-serif' },
];

const TEXT_COLORS = [
  { id: "white", hex: "#FFFFFF" },
  { id: "black", hex: "#000000" },
  { id: "red", hex: "#EF4444" },
  { id: "yellow", hex: "#EAB308" },
  { id: "neon", hex: "#39FF14" },
];

export const ProductEditor: React.FC<ProductEditorProps> = ({
  product,
  initialColor,
  onBack,
}) => {
  // Стейт для моделей (мужская/женская) и архитектуры масок
  const isPolo = product.name.toLowerCase().includes("поло");
  const [selectedModel, setSelectedModel] = useState<ModelType>(
    isPolo ? "polo" : "man",
  );
  const [selectedColor, setSelectedColor] = useState<Color>(initialColor);

  // Стейт для логотипа
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState<number>(100);

  // Стейт для текста
  const [customText, setCustomText] = useState<string>("");
  const [textFont, setTextFont] = useState<string>(FONT_OPTIONS[0].value);
  const [textColor, setTextColor] = useState<string>(TEXT_COLORS[0].hex);
  const [textPos, setTextPos] = useState({ x: 50, y: 30 });

  // Ссылки для drag-and-drop
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dragTarget = React.useRef<"text" | "logo" | null>(null);

  const handleMouseDown =
    (target: "text" | "logo") => (e: React.MouseEvent) => {
      e.preventDefault();
      dragTarget.current = target;
    };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragTarget.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100),
    );

    if (dragTarget.current === "text") {
      setTextPos({ x, y });
    }
    // Если понадобится двигать логотип, можно добавить логику сюда
  };

  const handleMouseUp = () => {
    dragTarget.current = null;
  };

  const colorLayerStyle = useMemo<React.CSSProperties>(() => {
    const maskUrl = `url(${MODEL_ASSETS[selectedModel].mask})`;

    return {
      backgroundColor: selectedColor.hex,
      mixBlendMode: "multiply",
      WebkitMaskImage: maskUrl,
      maskImage: maskUrl,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
    };
  }, [selectedColor.hex, selectedModel]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
      setLogoScale(100);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-200 pb-20 flex flex-col">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700&family=Montserrat:wght@400;700&family=Pacifico&family=Roboto:wght@400;700&display=swap');`}
      </style>

      {/* Кнопка назад */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-8">
        <button
          onClick={onBack}
          className="text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors flex items-center gap-2"
        >
          &larr; Назад в каталог
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 md:pt-10 w-full flex-1 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* ЛЕВАЯ КОЛОНКА: ЗОНА ПРЕДПРОСМОТРА */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-full lg:w-1/2 aspect-[3/4] lg:aspect-auto lg:h-[80vh] lg:sticky lg:top-8 flex items-center justify-center bg-white rounded-3xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm"
        >
          {/* Layer 1: Base (Нижний слой - фото модели) */}
          <img
            src={MODEL_ASSETS[selectedModel].base}
            alt={`Model ${selectedModel}`}
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
          />

          {/* Layer 2: Color Mask (красим только область футболки) */}
          <div
            className="absolute inset-0 w-full h-full z-20 pointer-events-none transition-colors duration-300"
            style={colorLayerStyle}
          />

          {/* Layer 3: Logo (Верхний слой - логотип) */}
          {logoUrl && (
            <div
              className="absolute z-30 pointer-events-none border border-dashed border-gray-400/30"
              style={{
                top: "35%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "28%",
              }}
            >
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-auto object-contain transition-transform duration-100 ease-linear"
                style={{ transform: `scale(${logoScale / 100})` }}
              />
            </div>
          )}

          {/* Layer 4: Text (Текстовый принт) */}
          {customText && (
            <div
              className="absolute inset-0 z-30 pointer-events-none"
              style={{
                WebkitMaskImage: `url(${MODEL_ASSETS[selectedModel].mask})`,
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
                maskImage: `url(${MODEL_ASSETS[selectedModel].mask})`,
                maskSize: "contain",
                maskPosition: "center",
              }}
            >
              <div
                onMouseDown={handleMouseDown("text")}
                className="absolute flex items-center justify-center cursor-move pointer-events-auto hover:ring-1 hover:ring-dashed hover:ring-gray-400/50 p-2 rounded"
                style={{
                  top: `${textPos.y}%`,
                  left: `${textPos.x}%`,
                  transform: "translate(-50%, -50%)",
                  width: "60%",
                  color: textColor,
                  fontFamily: textFont,
                  textAlign: "center",
                  whiteSpace: "pre-wrap",
                  fontSize: "clamp(16px, 4vw, 32px)",
                  fontWeight: textFont.includes("Pacifico") ? "normal" : "bold",
                  lineHeight: "1.2",
                  textShadow:
                    textColor === "#FFFFFF"
                      ? "0px 1px 3px rgba(0,0,0,0.3)"
                      : "none",
                  mixBlendMode: textColor === "#000000" ? "multiply" : "normal",
                }}
              >
                {customText}
              </div>
            </div>
          )}
        </div>

        {/* ПРАВАЯ КОЛОНКА: ПАНЕЛЬ УПРАВЛЕНИЯ */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-10 lg:py-8">
          {/* Заголовок и цена (из каталога) */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              {product.name}
            </h1>
            <p className="text-xl font-light text-gray-500">
              {product.price.toFixed(2)} RUB
            </p>
          </div>

          <div className="h-px w-full bg-gray-100" />

          {/* Блок "Модель" (Pill-style tabs) */}
          {!isPolo && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">
                Модель
              </h3>
              <div className="flex bg-gray-50 p-1 rounded-full w-fit border border-gray-100">
                <button
                  onClick={() => setSelectedModel("man")}
                  className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedModel === "man"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-gray-500 hover:text-slate-900"
                  }`}
                >
                  Мужская
                </button>
                <button
                  onClick={() => setSelectedModel("woman")}
                  className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedModel === "woman"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-gray-500 hover:text-slate-900"
                  }`}
                >
                  Женская
                </button>
              </div>
            </div>
          )}

          {/* Блок "Цвет" (Swatches из каталога) */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">
              Цвет
            </h3>
            <div className="flex flex-wrap gap-4">
              {product.colors.map((c) => (
                <div key={c.id} className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                    className={`w-10 h-10 rounded-full border transition-all duration-300 flex items-center justify-center focus:outline-none ${
                      selectedColor.id === c.id
                        ? "ring-1 ring-offset-4 ring-slate-900 border-transparent scale-110"
                        : "border-gray-200 hover:border-gray-400 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <span
                    className={`text-[10px] font-medium transition-colors max-w-[60px] text-center leading-tight ${
                      selectedColor.id === c.id
                        ? "text-slate-900"
                        : "text-gray-400"
                    }`}
                  >
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-gray-100" />

          {/* Блок "Текст" */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">
              Ваш текст
            </h3>
            <div className="space-y-4">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Введите надпись..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none transition-shadow"
                rows={2}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    Шрифт
                  </label>
                  <select
                    value={textFont}
                    onChange={(e) => setTextFont(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-900 outline-none text-sm bg-white cursor-pointer"
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
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    Цвет текста
                  </label>
                  <div className="flex gap-2">
                    {TEXT_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setTextColor(c.hex)}
                        title={c.id}
                        className={`w-9 h-9 rounded-full border transition-all focus:outline-none ${
                          textColor === c.hex
                            ? "ring-2 ring-offset-2 ring-slate-900 border-transparent scale-110"
                            : "border-gray-200 hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100" />

          {/* Блок "Дизайн" */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">
              Ваш логотип
            </h3>

            {!logoUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border border-gray-300 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-gray-50 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-10 h-10 mb-3 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="w-5 h-5 text-slate-900" />
                  </div>
                  <p className="text-sm text-slate-900 font-medium">
                    Загрузить логотип
                  </p>
                  <p className="text-xs text-gray-400 font-light mt-1">
                    SVG, PNG, JPG
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".svg,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                />
              </label>
            ) : (
              <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 p-2 flex items-center justify-center">
                      <img
                        src={logoUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Логотип загружен
                      </p>
                      <button
                        onClick={() => setLogoUrl(null)}
                        className="text-xs text-red-500 hover:text-red-600 mt-1 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Удалить
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <div className="flex justify-between text-xs uppercase tracking-widest">
                    <span className="text-gray-500 font-medium">Масштаб</span>
                    <span className="text-slate-900 font-medium">
                      {logoScale}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={logoScale}
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-slate-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Кнопка добавления в корзину */}
          <div className="pt-6">
            <button className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-semibold text-sm uppercase tracking-widest transition-all active:scale-[0.99] shadow-lg shadow-slate-900/20">
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
