
interface ServiceCardProps {
  image: string;
  title: string;
}

export const ServiceCard = ({ image, title }: ServiceCardProps) => {
  return (
    <div className="group flex flex-col h-[280px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex-grow relative h-[200px]">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          loading="lazy" 
        />
      </div>
      <div className="p-3 bg-white">
        <h3 className="text-lg font-semibold text-center text-gray-800 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
      </div>
    </div>
  );
};
