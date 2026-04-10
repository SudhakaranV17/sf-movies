from pydantic import BaseModel
from typing import Optional


class MovieResponse(BaseModel):
    id: int
    title: str
    release_year: Optional[int] = None
    locations: Optional[str] = None
    fun_facts: Optional[str] = None
    production_company: Optional[str] = None
    distributor: Optional[str] = None
    director: Optional[str] = None
    writer: Optional[str] = None
    actor_1: Optional[str] = None
    actor_2: Optional[str] = None
    actor_3: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    analysis_neighborhood: Optional[str] = None
    supervisor_district: Optional[str] = None

    model_config = {"from_attributes": True}
