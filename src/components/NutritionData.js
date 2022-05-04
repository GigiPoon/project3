const NutritionData = (props) => {

    return (
        <div className="wrapper">
            <ul className="menu">
                {props.nutritionData.map((food) => {
                    return (
                        <li key={food.tag_id}>
                            <img
                                src={food.photo.thumb}
                                alt={food.serving_unit}
                            />
                            <h2>{food.food_name}</h2>
                            <p>Calories: {food.nf_calories}</p>
                            <p>Carbohydrates: {food.nf_total_carbohydrate}</p>
                            <p>Protein: {food.nf_protein}</p>
                            <p>Dietary Fiber: {food.nf_dietary_fiber}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default NutritionData;


