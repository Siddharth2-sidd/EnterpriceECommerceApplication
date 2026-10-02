import {Link} from "react-router-dom";

const CategoryCard = ({category}) =>{
    return(
        <div className = "category-card">
            <div className = "category-image-container">
                {category.imageUrl ? (<img src={category.imageUrl} alt={category.name} className="category-image" />)
                :(<div className="category-image-placeholder">No Image</div>)}
            </div>
            <div className="category-context">
                <h3>{category.name}</h3>
                {category.description && (<p>{category.description}</p>)}
                <Link to={`/products?categoryid=${category.id}`} className="category-button">
                    View Products
                </Link>
            </div> 

        </div>
    )
}

export default CategoryCard;