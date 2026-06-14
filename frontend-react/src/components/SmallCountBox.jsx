import './AdminCountBox.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SmallCountBox({ leaves, title, subTitle, icon, bgColor, iconColor, iconBgColor }) {
    return (
        <div
            className="top-container h-100 d-flex gap-3 align-items-center"
            style={{ backgroundColor: bgColor }}
        >
            <div 
                className="rounded-circle d-flex align-items-center justify-content-center icon-div"
                style={ {backgroundColor: iconBgColor} }
            >
                <div className="icon-mark">
                    <FontAwesomeIcon icon={icon} size="2x" color={iconColor} />
                </div>
            </div>

            <div className="d-flex flex-column content-box">
                <h5 title={title}>{title}</h5>
                <h2>{leaves}</h2>
                <p className="text-secondary mb-0">{subTitle}</p>
            </div>
        </div>
    )
}

export default SmallCountBox;