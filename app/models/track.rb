class Track < ActiveRecord::Base
  belongs_to :mix
  has_many :regions, :dependent => :destroy

  accepts_nested_attributes_for :regions
  # attr_accessible :title, :body
end
