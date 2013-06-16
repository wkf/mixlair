class Region < ActiveRecord::Base
  belongs_to :track
  # attr_accessible :title, :body
end
