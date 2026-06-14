import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './CountsCard.css';

function StatsCard({
  title,
  count,
  icon,
  iconBg,
  iconColor,
  growth
}) {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <h4>{title}</h4>

        <div
          className="stats-icon"
          style={{ backgroundColor: iconBg }}
        >
          <FontAwesomeIcon
            icon={icon}
            style={{ color: iconColor }}
          />
        </div>
      </div>

      <div className="stats-body">
        <h2>{count}</h2>

        {growth && (
          <span className="growth-badge">
            {growth}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatsCard;