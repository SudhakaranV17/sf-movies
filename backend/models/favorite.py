from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from typing import TYPE_CHECKING
from database import Base

if TYPE_CHECKING:
    from .user import User
    from .movie import Movie

class Favorite(Base):
    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="favorites")
    movie: Mapped["Movie"] = relationship("Movie", back_populates="favorites")
