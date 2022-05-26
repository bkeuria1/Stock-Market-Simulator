import axios from "axios";
import {React,useState,useEffect} from "react";
import { Card } from "react-bootstrap";
const News = (props)=>{
    const [articles, setArticles] = useState([])
    useEffect(()=>{
        getNews()
    },[props.stock])

    const getNews = async()=>{
        //check database for news
        const res = await axios.get(`${process.env.REACT_APP_NEWS_URL}?stock=${props.stock}`,{withCredentials:true})
        setArticles(res.data.data)
    }
    return(
        <div>
            {articles?.length>0 ?
                <div style = {{overflowY: 'scroll', height: '40rem'}}>
                    {articles.map(article=>(
                        <Card style = {{margin : "2rem", padding: "4rem", justifyContent:'center'}}>
                            <Card.Title>{article.title}</Card.Title>
                            <Card.Text>{article.source} {article.published_at}</Card.Text>
                            <Card.Text>Summary: {article.description}</Card.Text>
                            <Card.Link href = {article.url}>Source</Card.Link>
                            <Card.Img src = {article.image_url}></Card.Img>
                        
                        </Card>
                    ))

                    }
                </div>
            :
            <div>
                <h1>No news found</h1>
            </div>
            

            }
        </div>
    )
}
export default News