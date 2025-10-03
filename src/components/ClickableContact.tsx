import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClickableContactProps {
  type: 'phone' | 'email' | 'whatsapp';
  value: string;
  className?: string;
  showIcon?: boolean;
  iconSize?: number;
  children?: React.ReactNode;
}

const ClickableContact: React.FC<ClickableContactProps> = ({
  type,
  value,
  className = '',
  showIcon = true,
  iconSize = 16,
  children
}) => {
  if (!value || value.trim() === '') {
    return null;
  }

  const getHref = () => {
    switch (type) {
      case 'phone':
        // Remove all non-digit characters except + for tel: link
        const cleanPhone = value.replace(/[^\d+]/g, '');
        return `tel:${cleanPhone}`;
      case 'email':
        return `mailto:${value.trim()}`;
      case 'whatsapp':
        // Remove all non-digit characters for WhatsApp
        const cleanWhatsApp = value.replace(/[^\d]/g, '');
        // Remove leading 91 if it exists and add it back
        const phoneNumber = cleanWhatsApp.startsWith('91') ? cleanWhatsApp : `91${cleanWhatsApp}`;
        return `https://wa.me/${phoneNumber}`;
      default:
        return '#';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'phone':
        return <Phone size={iconSize} />;
      case 'email':
        return <Mail size={iconSize} />;
      case 'whatsapp':
        return <MessageCircle size={iconSize} />;
      default:
        return null;
    }
  };

  const getDefaultStyles = () => {
    switch (type) {
      case 'phone':
        return 'text-blue-600 hover:text-blue-800 hover:underline';
      case 'email':
        return 'text-blue-600 hover:text-blue-800 hover:underline';
      case 'whatsapp':
        return 'text-green-600 hover:text-green-800 hover:underline';
      default:
        return 'text-blue-600 hover:text-blue-800 hover:underline';
    }
  };

  const displayValue = children || value;

  return (
    <a
      href={getHref()}
      className={cn(
        'inline-flex items-center gap-1 transition-colors duration-200',
        getDefaultStyles(),
        className
      )}
      target={type === 'whatsapp' ? '_blank' : undefined}
      rel={type === 'whatsapp' ? 'noopener noreferrer' : undefined}
      title={
        type === 'phone' 
          ? `Call ${value}` 
          : type === 'email' 
          ? `Send email to ${value}` 
          : `Send WhatsApp message to ${value}`
      }
    >
      {showIcon && getIcon()}
      <span>{displayValue}</span>
    </a>
  );
};

export default ClickableContact;
