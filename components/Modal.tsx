import React from 'react';
import { t } from '../utils/i18n';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onBack?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose, onBack }) => {
  const handleClose = onClose || onBack || (() => {});
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-slate-100 p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={handleClose} className="text-slate-500 hover:text-red-500 font-bold text-xl">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="bg-slate-50 p-4 border-t flex justify-end">
          <button 
            onClick={handleClose}
            className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};