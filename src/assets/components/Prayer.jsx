import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";



export default function ActionAreaCard({name, image, time}) {
  return (
    <Card style={{ margin: "0 10px", width:'25vw'}}>
      <CardActionArea>
        <CardMedia
          component="img"
          src= {image}
          height="140"
          alt="green iguana"
        />
        <CardContent>
          <Typography
            variant="h3"
            color="text.secondary"
            style={{ fontFamily: "IBM Plex Sans Arabic" }}
          >
            {name}
          </Typography>
          <Typography variant="h1" style={{ fontSize: "4rem", fontFamily:"inherit"}}>
            {time}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
