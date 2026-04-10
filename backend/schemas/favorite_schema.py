from pydantic import BaseModel
from schemas.movie_schema import MovieResponse


class FavoriteCreate(BaseModel):
    movie_id: int


class FavoriteResponse(BaseModel):
    id: int
    movie_id: int
    movie: MovieResponse

    model_config = {"from_attributes": True} # convert model object to pydantic schema
