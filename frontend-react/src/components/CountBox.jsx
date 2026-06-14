import './CountBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CountBox(props) {
    return (
        <div className={`cb-stat-card cb-stat-${props.variant}`}>
            <div>
                <p className="cb-stat-label">{props.title}</p>

                <h2 className="cb-stat-value">{props.leaves}</h2>

                <p className="cb-stat-sub">{props.subTitle}</p>
            </div>

            <div className={`cb-stat-icon cb-icon-${props.variant}`}>
                <FontAwesomeIcon icon={props.icon} />
            </div>
        </div>
    );
}

export default CountBox;