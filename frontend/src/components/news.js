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
        setArticles(res.data.finance.result.reports)
    }
    return(
        <div>
            {articles?.length>0 &&(
                <div>
                {articles.map(article=>(
                    <Card>
                        <Card.Title>
                            {article.title}
                        </Card.Title>
                        <Card.Text>
                            Provider: {article.provider}
                        </Card.Text>
                        <Card.Text>
                            Date : {article.publishedOn}
                        </Card.Text>
                        <Card.Text>
                            Summary: {article.summary}
                        </Card.Text>
                    </Card>
                ))

                }
                </div>

        )}
        </div>
    )
}
export default News