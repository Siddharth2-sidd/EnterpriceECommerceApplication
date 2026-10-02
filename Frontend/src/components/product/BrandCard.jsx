import {Link} from "react-router-dom" ;

const BrandCard = ({brand}) =>{
    return(
        <div className="brand-card">
            <div className="brand-content">
                <h3>{brand.name}</h3>
                {brand.description && (
                    <p>{brand.description}</p>
                )}
                <Link to={`\products?brandId=${brand.id}`} className="brand-button"> View Products </Link>
            </div>
        </div>
    );
};

export default BrandCard;