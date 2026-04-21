import React, { useMemo, useState } from "react";
import { UploadCloud, Trash2 } from "lucide-react";
import { toBlob } from "html-to-image";
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoScale, setLogoScale] = useState<number>(100);
  const [logoPos, setLogoPos] = useState({ x: 50, y: 35 });

  // Стейт для текста
  const [customText, setCustomText] = useState<string>("");
  const [textFont, setTextFont] = useState<string>(FONT_OPTIONS[0].value);
  const [textColor, setTextColor] = useState<string>(TEXT_COLORS[0].hex);
  const [textPos, setTextPos] = useState({ x: 50, y: 30 });
  const [textScale, setTextScale] = useState<number>(100);

  // Стейт для AI Мокапа
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMockupUrl, setGeneratedMockupUrl] = useState<string | null>(null);
  const [printType, setPrintType] = useState("DTF3");

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
    } else if (dragTarget.current === "logo") {
      setLogoPos({ x, y });
    }
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
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file));
      setLogoScale(100);
    }
  };

  const handleGenerateMockup = async () => {
    if (!containerRef.current || !logoFile) return;
    
    let imageBlob: Blob | null = null;
    
    try {
      // 1. Делаем снимок всего контейнера предпросмотра ДО включения лоадера
      // Используем pixelRatio для повышения качества (например, 2)
      imageBlob = await toBlob(containerRef.current, {
        quality: 1,
        pixelRatio: 2,
        // Убираем cacheBust: true, так как он ломает Blob URL
      });

      if (!imageBlob) {
        throw new Error('Не удалось создать снимок мокапа');
      }
    } catch (error) {
      console.error("Ошибка при создании снимка:", error);
      alert("Не удалось создать снимок для отправки.");
      return;
    }

    // ТОЛЬКО ПОСЛЕ успешного создания снимка включаем лоадер
    setIsGenerating(true);

    try {
      // 2. Собираем данные в FormData
      const formData = new FormData();
      formData.append('garmentImage', imageBlob, 'composed-garment.png');
      // Логотип больше не отправляем, так как он уже физически на снимке
      formData.append('printType', printType);

      console.log('--- ОТПРАВКА НА БЭКЕНД ---');
      for (let [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          console.log(`${key}: Blob/File (size: ${value.size} bytes, type: ${value.type}, name: ${(value as any).name || 'N/A'})`);
          // Добавляем ссылку для просмотра отправляемой картинки
          if (key === 'garmentImage') {
            const debugUrl = URL.createObjectURL(value);
            console.log(`👀 КЛИКНИТЕ СЮДА, ЧТОБЫ УВИДЕТЬ ОТПРАВЛЯЕМУЮ КАРТИНКУ: ${debugUrl}`);
            
            // АВТОМАТИЧЕСКОЕ СКАЧИВАНИЕ ДЛЯ ПРОВЕРКИ (чтобы точно увидеть оригинал)
            const a = document.createElement('a');
            a.href = debugUrl;
            a.download = 'debug-garment-image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // 3. Отправляем запрос на бэкенд
      const response = await fetch('http://localhost:3000/api/apply-print', {
        method: 'POST',
        body: formData,
      });

      console.log('--- ОТВЕТ ОТ БЭКЕНДА ---');
      console.log('Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Ошибка от бэкенда:', errorData);
        throw new Error(errorData.error || 'Ошибка при генерации мокапа');
      }

      // 4. Получаем бинарные данные картинки и создаем URL
      const resultBlob = await response.blob();
      console.log(`Получен Blob от бэкенда (size: ${resultBlob.size} bytes, type: ${resultBlob.type})`);
      
      const imageUrl = URL.createObjectURL(resultBlob);
      console.log('Сгенерированный локальный URL:', imageUrl);
      
      setGeneratedMockupUrl(imageUrl);
    } catch (error: any) {
      console.error("--- ПОЛНАЯ ОШИБКА ---", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert('Упс, ошибка: ' + (errorMessage === '[object Object]' ? JSON.stringify(error) : errorMessage));
    } finally {
      setIsGenerating(false);
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
          {/* Лоадер генерации AI-мокапа */}
          {isGenerating && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-900 font-medium animate-pulse">Нейросеть наносит принт...</p>
              <p className="text-sm text-gray-500 mt-2">Это может занять 5-15 секунд</p>
            </div>
          )}

          {/* Результат генерации AI-мокапа */}
          {generatedMockupUrl ? (
            <div className="absolute inset-0 z-40 bg-white flex items-center justify-center">
              <img src={generatedMockupUrl} alt="AI Mockup" className="w-full h-full object-contain" />
              <button
                onClick={() => {
                  URL.revokeObjectURL(generatedMockupUrl);
                  setGeneratedMockupUrl(null);
                }}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-medium text-slate-900 hover:bg-white transition-colors shadow-md border border-gray-200"
              >
                Вернуться к редактору
              </button>
            </div>
          ) : null}

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
              onMouseDown={handleMouseDown("logo")}
              className="absolute z-30 pointer-events-auto cursor-move hover:ring-1 hover:ring-dashed hover:ring-gray-400/50 p-2 rounded"
              style={{
                top: `${logoPos.y}%`,
                left: `${logoPos.x}%`,
                transform: "translate(-50%, -50%)",
                width: "28%",
              }}
            >
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-auto object-contain transition-transform duration-100 ease-linear pointer-events-none"
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
                  transform: `translate(-50%, -50%) scale(${textScale / 100})`,
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
                }}
              >
                {customText}
              </div>
            </div>
          )}

          {/* Layer 5: Shadow Overlay (Тени поверх принта и логотипа) */}
          <div
            className="absolute inset-0 z-40 pointer-events-none mix-blend-multiply opacity-60"
            style={{
              WebkitMaskImage: `url(${MODEL_ASSETS[selectedModel].mask})`,
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "center",
              maskImage: `url(${MODEL_ASSETS[selectedModel].mask})`,
              maskSize: "contain",
              maskPosition: "center",
            }}
          >
            <img
              src={MODEL_ASSETS[selectedModel].base}
              alt="Shadow Overlay"
              className="w-full h-full object-contain grayscale"
            />
          </div>
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
              
              {/* Ползунок масштаба текста */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span className="text-gray-500 font-medium">Размер текста</span>
                  <span className="text-slate-900 font-medium">
                    {textScale}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={textScale}
                  onChange={(e) => setTextScale(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-slate-900"
                />
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
                        onClick={() => {
                          setLogoUrl(null);
                          setLogoFile(null);
                          if (generatedMockupUrl) {
                            URL.revokeObjectURL(generatedMockupUrl);
                            setGeneratedMockupUrl(null);
                          }
                        }}
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

          {/* Блок "AI Мокап" */}
          {logoUrl && (
            <>
              <div className="h-px w-full bg-gray-100" />
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  AI Генерация
                </h3>
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl shadow-sm space-y-4">
                  <p className="text-sm text-indigo-900">
                    Посмотрите, как будет выглядеть принт в реальности с помощью нейросети Imagen 3.
                  </p>
                  <div className="space-y-2">
                    <label className="text-[10px] text-indigo-800 font-bold uppercase tracking-wider">
                      Тип печати
                    </label>
                    <select
                      value={printType}
                      onChange={(e) => setPrintType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white cursor-pointer"
                    >
                      <option value="DTF3">DTF3</option>
                      <option value="B2">B2</option>
                      <option value="D2">D2</option>
                      <option value="F1">F1</option>
                      <option value="F2">F2</option>
                      <option value="DTG2">DTG2</option>
                    </select>
                  </div>
                  <button
                    onClick={handleGenerateMockup}
                    disabled={isGenerating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Генерация...
                      </>
                    ) : (
                      "Сгенерировать фотореалистичный мокап"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

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
