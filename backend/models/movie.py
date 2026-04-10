from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float, Integer
from typing import Optional, TYPE_CHECKING
from database import Base

if TYPE_CHECKING:
    from .favorite import Favorite

class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    release_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    locations: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    fun_facts: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    production_company: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    distributor: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    director: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    writer: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    actor_1: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    actor_2: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    actor_3: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    analysis_neighborhood: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    supervisor_district: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)

    favorites: Mapped[list["Favorite"]] = relationship("Favorite", back_populates="movie", cascade="all, delete-orphan")
