class Mix < ActiveRecord::Base
  has_many :tracks, :dependent => :destroy

  accepts_nested_attributes_for :tracks
  # attr_accessible :title, :body
end
