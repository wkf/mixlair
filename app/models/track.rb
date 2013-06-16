class Track < ActiveRecord::Base
  belongs_to :mix
  has_many :regions, :dependent => :destroy
  has_many :effects, :dependent => :destroy

  accepts_nested_attributes_for :regions
  accepts_nested_attributes_for :effects

  # attr_accessible :title, :body
end
