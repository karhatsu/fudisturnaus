Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      namespace :public do
        resources :contacts, only: :create
        resources :tournaments, only: [:index, :show]
        resources :organizers, only: :index
      end

      namespace :official do
        resources :matches, only: :update
        resources :tournaments, only: [:show, :update] do
          put 'group_stage_results/:match_id' => 'group_stage_results#update'
          put 'playoff_results/:match_id' => 'playoff_results#update'
          resources :age_groups, only: [:create, :update, :destroy]
          resources :fields, only: [:create, :update, :destroy]
          resources :groups, only: [:create, :update, :destroy] do
            put 'lottery' => 'lotteries#update'
          end
          resources :group_stage_matches, only: [:create, :update, :destroy]
          resources :playoff_groups, only: [:create, :update, :destroy]
          resources :playoff_matches, only: [:create, :update, :destroy]
          resources :referees, only: [:create, :update, :destroy]
          resources :teams, only: [:create, :update, :destroy]
        end
        resources :clubs, only: :create
        resources :address_suggestions, only: :index
      end

      namespace :admin do
        resources :admin_sessions, only: :create
        resources :contacts, only: [:index, :show, :update]
        resources :clubs, only: [:index, :create, :update, :destroy]
        resources :unhandled_contacts, only: :index
        resources :tournaments, only: [:create, :destroy]
        resource :cache, only: :update
      end
    end
  end

  namespace :results do
    get ':results_access_key' => 'results#index'
  end

  namespace :referees do
    get ':referee_access_key' => 'referees#index'
  end

  namespace :official do
    get ':access_key/management' => 'official#index'
    get ':access_key' => 'official#index'
  end

  namespace :admin do
    root to: 'admin#index'
    get '*path', to: "admin#index"
  end

  resources :tournaments, only: :show
  get 't/:id', to: 'tournaments#show'

  root to: 'home#index'
  get '*path', to: "home#index"
end
