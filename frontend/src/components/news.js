import axios from "axios";
import {React,useState,useEffect} from "react";
import { Card } from "react-bootstrap";
const News = (props)=>{
    const [articles, setArticles] = useState([])
    useEffect(()=>{
        setArticles([])
        getNews()
    },[props.stock])

    const getNews = async()=>{
        const res = await axios.get(`http://localhost:3001/stock/news?stock=${props.stock}`,{withCredentials:true})
        setArticles(res.data.data)
    }
    return(
        <div>
            {articles?.length>0 &&(
                <div>
                {articles.map(article=>(
                    <Card style = {{padding : "5rem"}}>
                        <Card.Title>{article.title}</Card.Title>
                        <Card.Text>{article.source} {article.published_at}</Card.Text>
                        <Card.Text>Summary: {article.description}</Card.Text>
                        <Card.Link href = {article.url}>Source</Card.Link>
                        <Card.Img src = {article.image_url}></Card.Img>
                       
                    </Card>
                ))

                }
                </div>

        )}
        </div>
    )
}
export default News