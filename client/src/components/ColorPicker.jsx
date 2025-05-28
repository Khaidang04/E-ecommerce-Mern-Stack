import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ColorPicker = ({ themeType, onColorChange, onClose }) => {
  const { lightPresets, darkPresets } = useContext(ThemeContext);
  const presets = themeType === "light" ? lightPresets : darkPresets;

  const handleSelectPreset = (preset) => {
    onColorChange(preset); // Truyền toàn bộ preset (bao gồm name và colors)
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl transform transition-all duration-300 scale-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Chọn bảng màu cho chế độ {themeType === "light" ? "Sáng" : "Tối"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {presets.map((preset) => (
            <div
              key={preset.name}
              className="p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition duration-200"
              style={{ backgroundColor: preset.colors.background }}
              onClick={() => handleSelectPreset(preset)}
            >
              <h4
                className="text-sm font-medium"
                style={{ color: preset.colors.text }}
              >
                {preset.name}
              </h4>
              <p
                className="text-xs"
                style={{ color: preset.colors.textSecondary }}
              >
                Mẫu giao diện
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  className="px-3 py-1 rounded text-xs"
                  style={{
                    backgroundColor: preset.colors.buttonPrimary,
                    color: "#ffffff",
                  }}
                >
                  Nút chính
                </button>
                <button
                  className="px-3 py-1 rounded text-xs"
                  style={{
                    backgroundColor: preset.colors.buttonSecondary,
                    color: "#ffffff",
                  }}
                >
                  Nút phụ
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
