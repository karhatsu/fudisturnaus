class Api::V1::Public::OrganizersController < ApplicationController
  def index
    @organizers = ActiveRecord::Base.connection.execute 'select c.name, c.logo_url from clubs c join tournaments t on c.id = t.club_id where c.logo_url is not null group by c.name, c.logo_url order by c.name'
  end
end
