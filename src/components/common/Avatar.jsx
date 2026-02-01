import { getInitials } from '../../utils/helpers';

export default function Avatar({ src, alt, size = 'md', online = false }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl'
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover border-2 border-gray-200 dark:border-gray-700`}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-gray-200 dark:border-gray-700`}>
          {getInitials(alt)}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900"></span>
      )}
    </div>
  );
}