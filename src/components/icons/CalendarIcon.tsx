interface CalendarIconProps {
  className?: string;
}

const CalendarIcon: React.FC<CalendarIconProps> = ({
  className = "h-5 w-5",
}) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <line
        x1="3"
        y1="10"
        x2="21"
        y2="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="8"
        y1="3"
        x2="8"
        y2="7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="3"
        x2="16"
        y2="7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="6" y="12" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="10.5" y="12" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="15" y="12" width="3" height="3" rx="0.5" fill="currentColor" />
    </svg>
  );
};

export default CalendarIcon;
